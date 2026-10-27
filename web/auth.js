// auth.js: đăng ký, đăng nhập, đăng xuất bằng Supabase Auth. Dùng chung cho mọi trang trong thư mục web.
// Cách dùng trong trang HTML (thứ tự thẻ script quan trọng):
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   <script src="config.js"></script>
//   <script src="auth.js"></script>
// Sau đó dùng window.Auth.signIn(...), Auth.signUp(...), Auth.signOut(), Auth.requireLogin(), ...
(function () {
  "use strict";

  const cfg = window.APP_CONFIG || {};
  let client = null;

  function isConfigured() {
    return /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.SUPABASE_URL || "") &&
      !!cfg.SUPABASE_KEY && !/DAN-/.test(cfg.SUPABASE_KEY);
  }

  // Mỗi trang chỉ nên tạo MỘT client. Trang khác dùng lại Auth.getClient().
  function getClient() {
    if (client) return client;
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error("Không tải được thư viện Supabase. Kiểm tra kết nối mạng rồi tải lại trang.");
    }
    if (!isConfigured()) {
      throw new Error("Chưa cấu hình Supabase. Mở web/config.js và điền SUPABASE_URL, SUPABASE_KEY.");
    }
    client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY);
    return client;
  }

  // Đổi lỗi của Supabase sang tiếng Việt dễ hiểu
  function viError(err) {
    const code = (err && err.code) || "";
    const msg = ((err && err.message) || "").toLowerCase();
    if (code === "invalid_credentials" || msg.includes("invalid login credentials")) {
      return "Sai email hoặc mật khẩu.";
    }
    if (code === "user_already_exists" || msg.includes("already registered")) {
      return "Email này đã đăng ký. Hãy đăng nhập.";
    }
    if (code === "weak_password" || msg.includes("password should be")) {
      return "Mật khẩu quá yếu, cần ít nhất 6 ký tự.";
    }
    if (code === "email_not_confirmed" || msg.includes("not confirmed")) {
      return "Email chưa được xác nhận. Kiểm tra hộp thư hoặc nhờ quản trị tắt xác nhận email.";
    }
    if (code === "signup_disabled" || msg.includes("signups not allowed")) {
      return "Đăng ký tài khoản mới đang bị tắt. Nhờ quản trị bật lại hoặc tạo tài khoản giúp.";
    }
    if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit" || msg.includes("rate limit")) {
      return "Thao tác quá nhanh. Đợi vài phút rồi thử lại.";
    }
    if (code === "validation_failed" || msg.includes("invalid format") || msg.includes("unable to validate email")) {
      return "Email không hợp lệ.";
    }
    if (msg.includes("failed to fetch") || msg.includes("network")) {
      return "Không kết nối được máy chủ. Kiểm tra mạng, hoặc dự án Supabase đang tạm dừng.";
    }
    return (err && err.message) || "Có lỗi xảy ra, thử lại sau.";
  }

  // Đăng ký. Trả về { signedIn: true } nếu dùng được ngay;
  // { signedIn: false } nếu Supabase còn bật xác nhận email.
  async function signUp(email, password, fullName) {
    const { data, error } = await getClient().auth.signUp({
      email: String(email).trim(),
      password: password,
      options: { data: { full_name: String(fullName || "").trim() } }
    });
    if (error) throw new Error(viError(error));
    return { signedIn: !!data.session };
  }

  async function signIn(email, password) {
    const { error } = await getClient().auth.signInWithPassword({
      email: String(email).trim(),
      password: password
    });
    if (error) throw new Error(viError(error));
  }

  async function signOut() {
    const { error } = await getClient().auth.signOut();
    if (error) throw new Error(viError(error));
  }

  async function getSession() {
    const { data } = await getClient().auth.getSession();
    return data.session || null;
  }

  // Hồ sơ của người đang đăng nhập: { id, full_name } hoặc null
  async function getProfile() {
    const session = await getSession();
    if (!session) return null;
    const { data, error } = await getClient()
      .from("profiles").select("id, full_name").eq("id", session.user.id).maybeSingle();
    if (error) throw new Error(viError(error));
    return data;
  }

   // Dùng ở đầu các trang cần đăng nhập. Chưa đăng nhập thì chuyển về trang đăng nhập.
  async function requireLogin(loginUrl) {
    const session = await getSession();
    if (!session) {
      window.location.replace(loginUrl || "dang-nhap.html");
      return null;
    }
    return session;
  }

  // Gọi hàm cb khi người dùng đăng xuất (kể cả đăng xuất ở tab khác)
  function onSignedOut(cb) {
    getClient().auth.onAuthStateChange(function (event) {
      if (event === "SIGNED_OUT") cb();
    });
  }

  window.Auth = {
    isConfigured: isConfigured,
    getClient: getClient,
    viError: viError,
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    getSession: getSession,
    getProfile: getProfile,
    requireLogin: requireLogin,
    onSignedOut: onSignedOut
  };
})();
