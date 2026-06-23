// Cliente HTTP do painel admin. Reaproveita o cliente base (api.ts), que já
// injeta o token de admin (localStorage) quando presente — evita duplicação.
export {
  apiGet as authedGet,
  apiPost as authedPost,
  apiPatch as authedPatch,
  apiDelete as authedDelete,
} from "./api";
