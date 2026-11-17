/**
 * ============================================================================
 * NRKI — LOCAL REACT 18 RUNTIME (`assets/scripts/vendor/react-local.js`)
 * ----------------------------------------------------------------------------
 * Why this file exists:
 * Browsers block `<script type="module">` when you open HTML files directly
 * from your hard drive (`file://`) due to CORS security rules, and external
 * CDNs fail when offline.
 *
 * This lightweight, zero-dependency React runtime exposes `window.React`
 * (`createElement`, `Fragment`, `useState`, `useMemo`, `useEffect`) and
 * `window.ReactDOMClient` (`createRoot`) so your React `<Shelf />` component
 * and Gallery SPA run anywhere—online, offline, on `file://`, or on a server.
 * ============================================================================
 */

(function (global) {
  const Fragment = Symbol.for("react.fragment");

  /**
   * Creates a Virtual DOM element (`React.createElement` / `h`).
   */
  function createElement(type, props, ...children) {
    const flatChildren = [];
    const pushChild = (c) => {
      if (Array.isArray(c)) {
        c.forEach(pushChild);
      } else if (c !== null && c !== undefined && c !== false && c !== true) {
        flatChildren.push(c);
      }
    };
    children.forEach(pushChild);

    return {
      type,
      props: Object.assign({}, props, { children: flatChildren }),
    };
  }

  // Active component instance context during render
  let currentInstance = null;

  function useState(initialValue) {
    const instance = currentInstance;
    const idx = instance.hookIndex++;

    if (idx >= instance.hooks.length) {
      const value =
        typeof initialValue === "function" ? initialValue() : initialValue;
      instance.hooks.push({ type: "state", value });
    }

    const hook = instance.hooks[idx];
    const setState = (updater) => {
      const nextValue =
        typeof updater === "function" ? updater(hook.value) : updater;
      if (!Object.is(nextValue, hook.value)) {
        hook.value = nextValue;
        instance.rerender();
      }
    };

    return [hook.value, setState];
  }

  function useMemo(factory, deps) {
    const instance = currentInstance;
    const idx = instance.hookIndex++;

    if (idx >= instance.hooks.length) {
      const value = factory();
      instance.hooks.push({ type: "memo", value, deps });
      return value;
    }

    const hook = instance.hooks[idx];
    const hasChanged =
      !deps ||
      !hook.deps ||
      deps.length !== hook.deps.length ||
      deps.some((d, i) => !Object.is(d, hook.deps[i]));

    if (hasChanged) {
      hook.value = factory();
      hook.deps = deps;
    }
    return hook.value;
  }

  function useEffect(callback, deps) {
    const instance = currentInstance;
    const idx = instance.hookIndex++;

    if (idx >= instance.hooks.length) {
      instance.hooks.push({
        type: "effect",
        callback,
        deps,
        cleanup: null,
        needsRun: true,
      });
      return;
    }

    const hook = instance.hooks[idx];
    const hasChanged =
      !deps ||
      !hook.deps ||
      deps.length !== hook.deps.length ||
      deps.some((d, i) => !Object.is(d, hook.deps[i]));

    if (hasChanged) {
      hook.callback = callback;
      hook.deps = deps;
      hook.needsRun = true;
    }
  }

  /**
   * Renders a Virtual DOM node into real DOM nodes.
   */
  function renderVNode(vnode, rootInstance, path) {
    if (vnode === null || vnode === undefined || typeof vnode === "boolean") {
      return document.createTextNode("");
    }

    if (typeof vnode === "string" || typeof vnode === "number") {
      return document.createTextNode(String(vnode));
    }

    if (vnode.type === Fragment) {
      const frag = document.createDocumentFragment();
      (vnode.props.children || []).forEach((child, i) => {
        frag.appendChild(renderVNode(child, rootInstance, `${path}.f${i}`));
      });
      return frag;
    }

    // Functional React Component
    if (typeof vnode.type === "function") {
      const compKey = `${path}:${vnode.type.name || "Comp"}`;
      let compInstance = rootInstance.subInstances.get(compKey);
      if (!compInstance) {
        compInstance = {
          hooks: [],
          hookIndex: 0,
          rerender: () => rootInstance.rerender(),
        };
        rootInstance.subInstances.set(compKey, compInstance);
      }
      compInstance.hookIndex = 0;
      const prevInstance = currentInstance;
      currentInstance = compInstance;
      const rendered = vnode.type(vnode.props || {});
      currentInstance = prevInstance;

      const domNode = renderVNode(rendered, rootInstance, compKey);
      rootInstance.activeEffects.push(compInstance);
      return domNode;
    }

    // Standard HTML Element
    const el = document.createElement(vnode.type);
    const props = vnode.props || {};

    Object.entries(props).forEach(([key, val]) => {
      if (key === "children" || key === "key" || val === undefined || val === null) {
        return;
      }
      if (key === "className") {
        el.className = val;
      } else if (key === "style" && typeof val === "object") {
        Object.assign(el.style, val);
      } else if (key.startsWith("on") && typeof val === "function") {
        const eventName = key.slice(2).toLowerCase();
        el.addEventListener(eventName, val);
      } else if (key === "tabIndex") {
        el.tabIndex = val;
      } else {
        el.setAttribute(key, String(val));
      }
    });

    (props.children || []).forEach((child, i) => {
      const childKey =
        child && child.props && child.props.key != null ? child.props.key : i;
      el.appendChild(renderVNode(child, rootInstance, `${path}.${childKey}`));
    });

    return el;
  }

  /**
   * Mounts a React component tree into a DOM container.
   */
  function createRoot(container) {
    const rootInstance = {
      vnode: null,
      subInstances: new Map(),
      activeEffects: [],
      rerender() {
        if (!this.vnode) return;
        this.activeEffects = [];
        const dom = renderVNode(this.vnode, this, "root");
        container.innerHTML = "";
        container.appendChild(dom);

        // Run pending `useEffect` callbacks after DOM paint
        this.activeEffects.forEach((inst) => {
          inst.hooks.forEach((h) => {
            if (h.type === "effect" && h.needsRun) {
              if (typeof h.cleanup === "function") {
                try {
                  h.cleanup();
                } catch (_) {}
              }
              h.needsRun = false;
              const cleanup = h.callback();
              h.cleanup = typeof cleanup === "function" ? cleanup : null;
            }
          });
        });
      },
    };

    return {
      render(vnode) {
        rootInstance.vnode = vnode;
        rootInstance.rerender();
      },
    };
  }

  global.React = {
    createElement,
    Fragment,
    useState,
    useMemo,
    useEffect,
  };

  global.ReactDOMClient = {
    createRoot,
  };
})(window);

