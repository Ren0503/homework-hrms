const availableLangs = ['en', 'vi']
const messages = {
    en: {
        // Authenticate
        "200-auth": "Successful Authentication",
        "401-token": "Not authorized, token failed",
        "401-notoken": "Not authorized, no token",
        "401-admin": "Invalid name or password",
        "403": "Not authorized as an admin",
        "403-assign": "Not authorized, need admin assigned",
        "404-user": "Not found google account",

        // Generic
        "429": "Too Many Requests",
        "404": "Not Found Url",
        "400": "Invalid Type",

        // Document
        "404-doc": "Document not found",
        "200-docsFind": "Get successful documents",
        "200-docFind": "Get successful a document",
        "200-docsFind": "Get successful documents",
        "400-docCreateEmpty": "Need file in input",
        "400-docCreateBig": "File too large",
        "201-docCreate": "Created Success",
        "201-docUpdate": "Updated Success",
        "200-docDelete": "Removed Success",
        "200-docsDelete": "Removed Many Documents Success",
        "200-docsDeleteFind": "Get successful deleted documents",
        "200-docRestore": "Restored Success",

        // Confirm
        "200-listUser": "Get successful users for confirm",
        "400-confirm": "All users you send are assigned",
        "201-confirm": "Assigned Success",
        "200-unassign": "Unassigned Success",
        "200-confirm": "Confirm success"
    },
    vi: {
        // Authenticate
        "200-auth": "Xác thực thành công",
        "401-token": "Lỗi token, xác thực thất bại",
        "401-notoken": "Không có token, xác thực thất bại",
        "401-admin": "Sai tên hoặc mật khẩu",
        "403": "Tài khoản không phải là quản trị viên",
        "403-assign": "Không có quyền truy cập, cần quản trị viên cho phép",
        "404-user": "Không tìm thấy tài khoản google",

        // Generic
        "429": "Quá nhiều yêu cầu",
        "404": "Không tìm thấy đường dẫn",
        "500": "Hệ thống gặp sự cố",

        // Document
        "404-doc": "Không tìm thấy tài liệu",
        "200-docsFind": "Lấy nhiều tài liệu thành công",
        "200-docFind": "Lấy tài liệu thành công",
        "400-docCreateEmpty": "Cần tệp tin",
        "400-docCreateBig": "Tệp quá lớn",
        "201-docCreate": "Tạo thành công",
        "201-docUpdate": "Cập nhật thành công",
        "200-docDelete": "Xóa thành công",
        "200-docsDelete": "Xóa nhiều tài khoản thành công",
        "200-docsDeleteFind": "Lấy tài liệu đã xóa thành công",
        "200-docRestore": "Phục hồi thành công",

        // Confirm
        "200-listUser": "Lấy danh sách người dùng thành công",
        "400-confirm": "Danh sách người dùng bạn gửi đã được gán",
        "201-confirm": "Gán thành công",
        "200-unassign": "Gỡ thành công",
        "200-confirm": "Xác nhận thành công"
    }
}

module.exports = {
    availableLangs,
    messages
}