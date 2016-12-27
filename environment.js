onpoint = {};
onpoint.env = {
  error: "error",
  auth: {
    success: "auth:success",
    failure:   "auth:failure"
  },
  data: {
    refresh: "data.refresh"
  },
  // @if ENV == 'GENYMOTION'
  baseURL: "http://10.0.3.2:5000/api/v0/",
  mainURL: "https://vivid-inferno-5187.firebaseio.com/",
  debug: true
  // @endif
  // @if ENV == 'DEVELOPMENT'
  baseURL: "http://localhost:5000/api/v0/",
  mainURL: "https://vivid-inferno-5187.firebaseio.com/",
  debug: true
  // @endif
  // @if ENV == 'PRODUCTION'
  baseURL: "https://www.onpoint.com/api/v0/",
  mainURL: "https://vivid-inferno-5187.firebaseio.com/",
  debug: false
  // @endif
}
