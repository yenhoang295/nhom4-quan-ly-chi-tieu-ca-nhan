// nav.js: thanh điều hướng bên trái dùng chung cho các trang trong web/
(function () {
  "use strict";

  var ICONS = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 9.5V20h14V9.5"/>',
    expense: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8"/><path d="M8.5 12.5L12 16l3.5-3.5"/>',
    income: '<circle cx="12" cy="12" r="9"/><path d="M12 16V8"/><path d="M8.5 11.5L12 8l3.5 3.5"/>',
    family: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.4 0 4 1.8 4 4.5"/>',
    admin: '<path d="M12 3l8 3v6c0 4.5-3.3 7.8-8 9-4.7-1.2-8-4.5-8-9V6z"/>',
    demo: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
        cat: '<path d="M4 4h7v7H4z"/><path d="M13 4h7v7h-7z"/><path d="M4 13h7v7H4z"/><path d="M13 13h7v7h-7z"/>',
    report: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>'
  };

    var PAGES = [
    { href: "trang-chu.html", label: "Trang chủ", icon: "home" },
    { href: "thu-nhap.html", label: "Thu nhập", icon: "income" },
    { href: "index.html", label: "Chi tiêu", icon: "expense" },
    { href: "danh-muc.html", label: "Danh mục", icon: "cat" },
    { href: "bao-cao.html", label: "Báo cáo", icon: "report" },
    { href: "gia-dinh.html", label: "Gia đình", icon: "family" },
    { href: "gia-dinh-quan-tri.html", label: "Quản trị", icon: "admin", admin: true },
    { href: "cai-dat.html", label: "Cài đặt", icon: "settings" },
    { href: "demo.html", label: "Xem thử", icon: "demo" }
  ];

  function pageName(path) {
    var f = (path.split("/").pop() || "index").replace(/\.html$/, "");
    return f || "index";
  }

  var current = pageName(location.pathname);
  if (current === "dang-nhap") return;

  function svg(key) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = ICONS[key]; // chuỗi cố định trong file, không lấy từ người dùng
    return s;
  }

  function build() {
    var nav = document.createElement("nav");
    nav.className = "site-nav";
    nav.setAttribute("aria-label", "Điều hướng chính");

    var brand = document.createElement("a");
    brand.className = "site-nav-brand";
    brand.href = "trang-chu.html";
    var logo = document.createElement("span");
    logo.className = "site-nav-logo";
    logo.textContent = "₫";
    var bt = document.createElement("span");
    bt.className = "site-nav-title";
    bt.textContent = "Sổ chi tiêu";
    brand.appendChild(logo);
    brand.appendChild(bt);
    nav.appendChild(brand);

    var list = document.createElement("div");
    list.className = "site-nav-links";
    var adminLink = null;
    PAGES.forEach(function (p) {
      var a = document.createElement("a");
      a.href = p.href;
      a.appendChild(svg(p.icon));
      var t = document.createElement("span");
      t.textContent = p.label;
      a.appendChild(t);
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

    var foot = document.createElement("div");
    foot.className = "site-nav-foot";

    var who = document.createElement("span");
    who.className = "site-nav-user";
    who.hidden = true;
    foot.appendChild(who);

    var inLink = document.createElement("a");
    inLink.className = "site-nav-in";
    inLink.href = "dang-nhap.html";
    inLink.textContent = "Đăng nhập";
    inLink.hidden = true;
    foot.appendChild(inLink);

    var out = document.createElement("button");
    out.type = "button";
    out.className = "site-nav-out";
    out.textContent = "Đăng xuất";
    out.hidden = true;
    out.addEventListener("click", function () {
      var done = function () { window.location.replace("dang-nhap.html"); };
      window.Auth.signOut().then(done, done);
    });
    foot.appendChild(out);
    nav.appendChild(foot);

    document.body.classList.add("has-sidenav");
    document.body.insertBefore(nav, document.body.firstChild);
    setup(adminLink, out, inLink, who);
  }

  // Quyết định hiện Đăng nhập hay Đăng xuất, tên người dùng, và mục Quản trị
  function setup(adminLink, out, inLink, who) {
    var ok = window.Auth && window.Auth.isConfigured && window.Auth.isConfigured();
    if (!ok) { inLink.hidden = false; return; }
    var client;
    try { client = window.Auth.getClient(); } catch (e) { inLink.hidden = false; return; }

    window.Auth.getSession().then(function (session) {
      if (!session) { inLink.hidden = false; return; }
      out.hidden = false;
      who.textContent = session.user.email || "";
      who.hidden = !who.textContent;

      window.Auth.getProfile().then(function (p) {
        if (p && p.full_name) { who.textContent = p.full_name; who.hidden = false; }
      }).catch(function () { /* giữ email */ });

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