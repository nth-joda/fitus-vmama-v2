const validateError = {
  data: null,
  error: "Bad request",
  message: "Thao tác thất bại, yêu cầu thiếu thông tin.",
  status: 400,
};

const authenticationError = {
  data: null,
  error: "Unauthorized",
  message:
    "Sai thông tin đăng nhập, hoặc phiên đăng nhập hết hạn, hoặc tài khoản được đăng nhập ở nơi khác.",
  status: 401,
};

const forbidden = {
  data: null,
  error: "forbidden",
  message:
    "Bạn không có quyền truy cập dữ liệu này hoặc phiên đăng nhập của bạn đã hết hạn.",
  status: 403,
};

const notFound = {
  data: null,
  error: "not found",
  message: "Dữ liệu không hợp lệ.",
  status: 404,
};

const internalServerError = {
  data: null,
  error: "Internal Server Error",
  message: "Lỗi hệ thống, thử lại sau.",
  status: 500,
};

const NetworkError = {
  data: null,
  error: "Network Error",
  message: "Lỗi đường truyền, thử lại sau",
  status: 405,
};

const UnknownError = {
  data: null,
  error: "Unknown Error",
  message: "Lỗi không xác định, thử lại sau",
  status: 999,
};

const ServerResponse = (props) => {
  if (props.code === "ERR_NETWORK") {
    return NetworkError;
  }
  if (props.status === 200) {
    return props.data;
  }
  if (props.response) {
    if (props.response.data) {
      switch (props.response.data.status) {
        case 400:
          return validateError;
        case 401:
          return authenticationError;
        case 403:
          return forbidden;
        case 404:
          return notFound;
        case 500:
          return internalServerError;
        default:
          return props.response.data;
      }
    }
  }
  return props.data ? props.data : UnknownError;
};

export default ServerResponse;
