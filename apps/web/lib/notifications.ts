export const notifications = {
  "account-created": { type: "success", message: "確認メールを送信しました。メール内のリンクを開いて登録を完了してください。" },
  "auth-failed": { type: "error", message: "認証に失敗しました。もう一度お試しください。" },
  "invalid-credentials": { type: "error", message: "メールアドレスまたはパスワードが正しくありません。" },
  "email-unconfirmed": { type: "error", message: "確認メール内のリンクを開いてからログインしてください。" },
  "email-in-use": { type: "error", message: "このメールアドレスは既に登録されています。" },
  "oauth-start-failed": { type: "error", message: "ログインを開始できませんでした。もう一度お試しください。" },
  "invalid-input": { type: "error", message: "入力内容を確認してください。" },
  "required-images": { type: "error", message: "ロゴとメイン画像を選択してください。" },
  "product-submission-failed": { type: "error", message: "Productを送信できませんでした。もう一度お試しください。" },
  "product-submitted": { type: "success", message: "Productを審査に送信しました。" },
  "arena-queue-failed": { type: "error", message: "Arenaの参加待ちQueueへ追加できませんでした。" },
  "product-update-failed": { type: "error", message: "Productを更新できませんでした。もう一度お試しください。" },
  "vote-failed": { type: "error", message: "投票を送信できませんでした。もう一度お試しください。" },
  "comment-invalid": { type: "error", message: "コメントは2〜2,000文字で入力してください。" },
  "comment-failed": { type: "error", message: "コメントを投稿できませんでした。もう一度お試しください。" },
  "admin-action-failed": { type: "error", message: "管理操作を完了できませんでした。もう一度お試しください。" },
  "account-deleted": { type: "success", message: "アカウントを削除しました。" },
  "account-deletion-failed": { type: "error", message: "アカウントを削除できませんでした。もう一度お試しください。" },
  "password-reset-sent": { type: "success", message: "該当するアカウントがある場合、パスワード再設定メールを送信しました。" },
  "password-reset-complete": { type: "success", message: "パスワードを更新しました。新しいパスワードでログインしてください。" },
  "password-reset-invalid": { type: "error", message: "再設定リンクが無効か期限切れです。もう一度お試しください。" },
} as const;

export type NotificationCode = keyof typeof notifications;

export function authErrorNotice(error: unknown): NotificationCode {
  const message = error instanceof Error ? error.message : "";
  if (/invalid login credentials/i.test(message)) return "invalid-credentials";
  if (/email not confirmed/i.test(message)) return "email-unconfirmed";
  if (/already registered/i.test(message)) return "email-in-use";
  return "auth-failed";
}
