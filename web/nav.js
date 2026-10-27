// nav.js: thanh điều hướng dùng chung cho các trang trong web/
(function () {
  "use strict";

  var PAGES = [
    { href: "trang-chu.html", label: "Trang chủ" },
    { href: "index.html", label: "Khoản chi" },
    { href: "thu-nhap.html", label: "Thu nhập" },
    { href: "gia-dinh.html", label: "Gia đình" },
    { href: "gia-dinh-quan-tri.html", label: "Quản trị", admin: true },
    { href: "demo.html", label: "Xem thử" }
  ];

  function pageName(path) {
    var f = (path.split("/").pop() || "index").replace(/\.html$/, "");
    return f || "index";
  }

  var current = pageName(location.pathname);
  if (current === "dang-nhap") return;

  function build() {
    var nav = document.createElement("nav");
    nav.className = "site-nav";
    nav.setAttribute("aria-label", "Điều hướng chính");

    var brand = document.createElement("a");
    brand.className = "site-nav-brand";
    brand.href = "trang-chu.html";
    brand.textContent = "Sổ chi tiêu";
    nav.appendChild(brand);

    var list = document.createElement("div");
    list.className = "site-nav-links";
    var adminLink = null;
    PAGES.forEach(function (p) {
      var a = document.createElement("a");
      a.href = p.href;
      a.textContent = p.label;
      if (pageName(p.href) === current) {
        a.className = "active";
        a.setAttribute("aria-current", "page");
      } else if (p.admin) {
        a.hidden = true; // chỉ hiện cho quản trị viên, kiểm tra bên dưới
        adminLink = a;
      }
      list.appendChild(a);
    });
    nav.appendChild(list);

    var inLink = document.createElement("a");
    inLink.className = "site-nav-in";
    inLink.href = "dang-nhap.html";
    inLink.textContent = "Đăng nhập";
    inLink.hidden = true;
    nav.appendChild(inLink);

    var out = document.createElement("button");
    out.type = "button";
    out.className = "site-nav-out";
    out.textContent = "Đăng xuất";
    out.hidden = true;
    out.addEventListener("click", function () {
      var done = function () { window.location.replace("dang-nhap.html"); };
      window.Auth.signOut().then(done, done);
    });
    nav.appendChild(out);

    document.body.insertBefore(nav, document.body.firstChild);
    setup(adminLink, out, inLink);
  }

  // Quyết định hiện Đăng nhập hay Đăng xuất, và có hiện mục Quản trị không
  function setup(adminLink, out, inLink) {
    var ok = window.Auth && window.Auth.isConfigured && window.Auth.isConfigured();
    if (!ok) { inLink.hidden = false; return; }
    var client;
    try { client = window.Auth.getClient(); } catch (e) { inLink.hidden = false; return; }

    window.Auth.getSession().then(function (session) {
      if (!session) { inLink.hidden = false; return; }
      out.hidden = false;
      if (!adminLink) return;
      client.from("family_members").select("role")
        .eq("user_id", session.user.id).maybeSingle()
        .then(function (res) {
          if (res && res.data && res.data.role === "admin") adminLink.hidden = false;
        })
        .catch(function () { /* giữ ẩn nếu không kiểm tra được */ });
    }).catch(function () { inLink.hidden = false; });
  }

  if (document.body) build();
  else document.addEventListener("DOMContentLoaded", build);
})();