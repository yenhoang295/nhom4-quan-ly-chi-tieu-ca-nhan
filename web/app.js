// Sổ chi tiêu cá nhân: giao diện web nối với Supabase (PostgreSQL).
(function () {
  "use strict";

  const cfg = window.APP_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const nf = new Intl.NumberFormat("vi-VN");
  const COLORS = ["#0e7c7b", "#b4233f", "#d9980b", "#3b5ba5", "#7a4e9b", "#5e8c31", "#c8501e", "#5b6b7a"];

  const state = { categories: [], expenses: [], month: "" };
  let db = null;

  /* ---------- Hàm tiện ích ---------- */
  function money(n) {
    return nf.format(n) + " ₫";
  }

  function todayISO() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  // "2026-10" -> { start: "2026-10-01", next: "2026-11-01" }
  function monthRange(ym) {
    const [y, m] = ym.split("-").map(Number);
    const ny = m === 12 ? y + 1 : y;
    const nm = m === 12 ? 1 : m + 1;
    return { start: ym + "-01", next: ny + "-" + String(nm).padStart(2, "0") + "-01" };
  }

  function monthLabel(ym) {
    const [y, m] = ym.split("-");
    return "tháng " + Number(m) + "/" + y;
  }

  // Chấp nhận "50000", "50.000", "50,000", "50 000". Không nhận số thập phân.
  function parseAmount(text) {
    const digits = String(text).replace(/[\s.,_]/g, "");
    if (!/^\d+$/.test(digits)) return NaN;
    const n = Number(digits);
    return n <= 1e12 ? n : NaN;
  }

  function h(tag, props, ...kids) {
    const e = document.createElement(tag);
    Object.entries(props || {}).forEach(([k, v]) => {
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else e.setAttribute(k, v);
    });
    kids.forEach((kid) => e.append(kid));
    return e;
  }

  function categoryName(row) {
    const c = row.categories;
    const name = Array.isArray(c) ? (c[0] && c[0].name) : c && c.name;
    return name || "Không rõ";
  }

  /* ---------- Thông báo ---------- */
  function showBanner(msg) {
    const b = $("banner");
    b.textContent = msg || "";
    b.hidden = !msg;
  }

  let toastTimer = 0;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
  }

  function friendlyError(err) {
    const code = err && err.code;
    if (code === "42P01" || code === "PGRST205") {
      return "Chưa có bảng dữ liệu. Chạy file supabase/schema.sql trong SQL Editor của Supabase, rồi tải lại trang.";
    }
    if (code === "42501") {
      return "Supabase từ chối truy cập. Chạy lại phần chính sách (policy) trong file supabase/schema.sql.";
    }
    return "Không kết nối được cơ sở dữ liệu. Nếu dự án Supabase đang tạm dừng, vào supabase.com bấm Restore rồi tải lại trang. Chi tiết: " +
      ((err && err.message) || "không rõ");
  }

  function setError(id, msg) {
    $(id).setAttribute("aria-invalid", "true");
    $(id + "Error").textContent = msg;
  }

  function clearErrors(form) {
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    form.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
  }

  /* ---------- Đọc dữ liệu ---------- */
  async function loadCategories() {
    const { data, error } = await db.from("categories").select("id, name").order("name");
    if (error) throw error;
    state.categories = data || [];
    fillCategorySelects();
  }

  async function loadExpenses() {
    const { start, next } = monthRange(state.month);
    const { data, error } = await db
      .from("expenses")
      .select("id, spent_on, amount, note, category_id, categories(name)")
      .gte("spent_on", start)
      .lt("spent_on", next)
      .order("spent_on", { ascending: false })
      .order("id", { ascending: false });
    if (error) throw error;
    state.expenses = data || [];
    render();
  }

  async function reload() {
    try {
      showBanner("");
      await Promise.all([loadCategories(), loadExpenses()]);
    } catch (err) {
      showBanner(friendlyError(err));
    }
  }

  /* ---------- Vẽ giao diện ---------- */
  function fillCategorySelects() {
    const form = $("categoryId");
    const filter = $("filterCategory");
    const keepForm = form.value;
    const keepFilter = filter.value;

    form.replaceChildren(h("option", { value: "", text: "Chọn danh mục" }));
    filter.replaceChildren(h("option", { value: "", text: "Tất cả danh mục" }));
    state.categories.forEach((c) => {
      form.append(h("option", { value: String(c.id), text: c.name }));
      filter.append(h("option", { value: String(c.id), text: c.name }));
    });
    form.value = keepForm;
    filter.value = keepFilter;
  }

  function colorOf(categoryId) {
    const i = state.categories.findIndex((c) => c.id === categoryId);
    return COLORS[(i < 0 ? 0 : i) % COLORS.length];
  }

  function render() {
    const rows = state.expenses;
    const total = rows.reduce((s, r) => s + Number(r.amount), 0);
    $("total").textContent = money(total);
    $("count").textContent = rows.length
      ? rows.length + " khoản chi trong " + monthLabel(state.month)
      : "Chưa có khoản chi nào trong " + monthLabel(state.month);
    renderSplit(rows, total);
    renderList();
  }

  function renderSplit(rows, total) {
    const bar = $("splitBar");
    const legend = $("legend");
    bar.replaceChildren();
    legend.replaceChildren();

    const sums = new Map();
    rows.forEach((r) => {
      const cur = sums.get(r.category_id) || { name: categoryName(r), amount: 0 };
      cur.amount += Number(r.amount);
      sums.set(r.category_id, cur);
    });
    const parts = [...sums.entries()].sort((a, b) => b[1].amount - a[1].amount);

    bar.setAttribute(
      "aria-label",
      parts.length
        ? "Tỷ lệ chi theo danh mục: " + parts.map(([, p]) => p.name + " " + Math.round((p.amount / total) * 100) + "%").join(", ")
        : "Chưa có dữ liệu chi theo danh mục"
    );

    parts.forEach(([id, p]) => {
      const seg = h("span", { class: "seg", title: p.name + ": " + money(p.amount) });
      seg.style.flexGrow = String(p.amount);
      seg.style.background = colorOf(id);
      bar.append(seg);

      const pct = (p.amount / total) * 100;
      const sw = h("span", { class: "swatch" });
      sw.style.background = colorOf(id);
      legend.append(
        h("li", {}, sw, h("span", { text: p.name }), h("span", { class: "amt", text: money(p.amount) }),
          h("span", { class: "pct", text: pct < 1 ? "<1%" : Math.round(pct) + "%" }))
      );
    });
  }

  function renderList() {
    const filter = $("filterCategory").value;
    const rows = state.expenses.filter((r) => !filter || String(r.category_id) === filter);
    const ul = $("rows");
    const empty = $("empty");
    ul.replaceChildren();

    rows.forEach((r) => {
      const [y, m, d] = r.spent_on.split("-");
      const name = categoryName(r);
      const what = h("div", { class: "what" }, h("span", { class: "cat", text: name }));
      if (r.note) what.append(h("span", { class: "note", text: r.note }));
      const del = h("button", {
        type: "button",
        class: "del",
        "data-id": String(r.id),
        "aria-label": "Xóa khoản chi " + name + " ngày " + d + "/" + m + ", " + money(Number(r.amount)),
        text: "Xóa"
      });
      ul.append(
        h("li", { class: "row" },
          h("time", { datetime: r.spent_on, text: d + "/" + m }),
          what,
          h("span", { class: "amt", text: money(Number(r.amount)) }),
          del)
      );
    });

    if (rows.length) {
      empty.hidden = true;
    } else {
      empty.hidden = false;
      empty.textContent = state.expenses.length
        ? "Không có khoản chi nào thuộc danh mục này trong " + monthLabel(state.month) + "."
        : "Chưa có khoản chi nào trong " + monthLabel(state.month) + ". Nhập khoản đầu tiên ở khung bên trái.";
    }
  }

  /* ---------- Thao tác của người dùng ---------- */
  async function onAddExpense(e) {
    e.preventDefault();
    const form = e.currentTarget;
    clearErrors(form);

    const spentOn = $("spentOn").value;
    const amount = parseAmount($("amount").value);
    const categoryId = $("categoryId").value;
    const note = $("note").value.trim();

    const problems = [];
    if (!spentOn) problems.push(["spentOn", "Chọn ngày chi."]);
    if (!Number.isFinite(amount) || amount <= 0) {
      problems.push(["amount", "Nhập số tiền là số nguyên lớn hơn 0, ví dụ 50000."]);
    }
    if (!categoryId) {
      problems.push(["categoryId", "Chọn một danh mục. Nếu chưa có, tạo danh mục ở khung bên dưới."]);
    }
    if (problems.length) {
      problems.forEach(([id, msg]) => setError(id, msg));
      $(problems[0][0]).focus();
      return;
    }

    const btn = $("expenseBtn");
    btn.disabled = true;
    try {
      const { error } = await db.from("expenses").insert({
        spent_on: spentOn,
        amount: amount,
        category_id: Number(categoryId),
        note: note || null
      });
      if (error) throw error;

      const savedMonth = spentOn.slice(0, 7);
      if (savedMonth !== state.month) {
        state.month = savedMonth;
        $("month").value = savedMonth;
      }
      await loadExpenses();
      $("amount").value = "";
      $("note").value = "";
      $("amount").focus();
      toast("Đã lưu khoản chi");
    } catch (err) {
      showBanner(friendlyError(err));
    } finally {
      btn.disabled = false;
    }
  }

  async function onAddCategory(e) {
    e.preventDefault();
    const form = e.currentTarget;
    clearErrors(form);

    const name = $("catName").value.trim();
    if (!name) {
      setError("catName", "Nhập tên danh mục.");
      $("catName").focus();
      return;
    }

    const btn = $("catBtn");
    btn.disabled = true;
    try {
      const { data, error } = await db.from("categories").insert({ name: name }).select("id").single();
      if (error) {
        if (error.code === "23505") {
          setError("catName", "Danh mục này đã có. Đặt tên khác.");
          return;
        }
        throw error;
      }
      await loadCategories();
      $("categoryId").value = String(data.id);
      $("catName").value = "";
      render();
      toast("Đã tạo danh mục");
    } catch (err) {
      showBanner(friendlyError(err));
    } finally {
      btn.disabled = false;
    }
  }

  async function onDelete(e) {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;
    if (!window.confirm("Xóa khoản chi này?")) return;
    btn.disabled = true;
    try {
      const { error } = await db.from("expenses").delete().eq("id", Number(btn.dataset.id));
      if (error) throw error;
      await loadExpenses();
      toast("Đã xóa khoản chi");
    } catch (err) {
      btn.disabled = false;
      showBanner(friendlyError(err));
    }
  }

  async function onMonthChange() {
    const v = $("month").value;
    if (!v) {
      $("month").value = state.month;
      return;
    }
    state.month = v;
    try {
      showBanner("");
      await loadExpenses();
    } catch (err) {
      showBanner(friendlyError(err));
    }
  }

  /* ---------- Khởi động ---------- */
  function init() {
    state.month = todayISO().slice(0, 7);
    $("month").value = state.month;
    $("spentOn").value = todayISO();

    $("expenseForm").addEventListener("submit", onAddExpense);
    $("categoryForm").addEventListener("submit", onAddCategory);
    $("rows").addEventListener("click", onDelete);
    $("month").addEventListener("change", onMonthChange);
    $("filterCategory").addEventListener("change", renderList);
    fillCategorySelects();
    render();

    const okUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.SUPABASE_URL || "");
    if (!okUrl || !cfg.SUPABASE_KEY || /DAN-/.test(cfg.SUPABASE_KEY)) {
      showBanner("Chưa cấu hình Supabase. Mở file web/config.js, dán SUPABASE_URL và SUPABASE_KEY lấy từ trang Project Settings của Supabase.");
      return;
    }
    if (!window.supabase || !window.supabase.createClient) {
      showBanner("Không tải được thư viện Supabase. Kiểm tra kết nối mạng và tải lại trang.");
      return;
    }
    db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY);
    reload();
  }

  init();
})();
