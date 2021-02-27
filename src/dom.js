window.dom = {
  create(html) {
    const container = document.createElement("template");
    container.innerHTML = html.trim();
    return container.content.firstChild;
  },
  after(node, node2) {
    node.parentNode.insertBefore(node2, node.nextSibling);
  },
  before(node, node2) {
    node.parentNode.insertBefore(node2, node);
  },
  append(parent, node) {
    parent.appendChild(node);
  },
  // 用 parent 包围 node，appendChild 是移动，原来的会自动消失
  wrap(node, parent) {
    dom.before(node, parent);
    dom.append(parent, node);
  },

  empty(node) {
    const ret = Array.from(node.childNodes);
    ret.forEach((c) => c.remove());
    return ret;
  },
  attr(node, attributeName, attributeValue) {
    if (!attributeValue) return node.getAttribute(attributeName);
    node.setAttribute(attributeName, attributeValue);
  },
  text(node, string) {
    const key = "innerText" in node ? "innerText" : "textContent";
    if (!string) return node[key];
    node[key] = string;
  },
  style(node, name, value) {
    if (value) {
      // dom.style(div, 'color', 'red')
      node.style[name] = value;
    } else {
      if (typeof name === "string") {
        // dom.style(div, 'color')
        return node.style[name];
      } else if (name instanceof Object) {
        // dom.style(div, {color: 'red'})
        const object = name;
        for (let key in object) {
          node.style[key] = object[key];
        }
      }
    }
  },
  class: {
    add(node, className) {
      node.classList.add(className);
    },
    remove(node, className) {
      node.classList.remove(className);
    },
    has(node, className) {
      return node.classList.contains(className);
    },
  },
  on(node, eventName, handler) {
    node.addEventListener(eventName, handler);
  },
  off(node, eventName, handler) {
    node.removeEventListener(eventName, handler);
  },
  delegation(eventType, element, selector, fn) {
    element.addEventListener(eventType, (e) => {
      let el = e.target;
      while (!el.matches(selector)) {
        if (element === el) {
          el = null;
          break;
        }
        el = el.parentNode;
      }
      el && fn.call(el, e, el);
    });
    return element;
  },
  find(selector, node) {
    return (node || document).querySelectorAll(selector);
  },
  parent(node) {
    return node.parentNode;
  },
  allSiblings(node) {
    return Array.from(node.parentNode.children);
  },
  siblings(node) {
    return dom.allSiblings(node).filter((s) => s !== node);
  },
  next(node) {
    const children = dom.allSiblings(node);
    return children[children.findIndex((n) => n === node) + 1];
  },
  previous(node) {
    const children = dom.allSiblings(node);
    return children[children.findIndex((n) => n === node) - 1];
  },
  children(node) {
    return node.children;
  },
  each(nodeList, fn) {
    Array.from(nodeList).forEach((n) => fn(n));
  },
  index(node) {
    return dom.allSiblings(node).findIndex((n) => n === node);
  },
};
