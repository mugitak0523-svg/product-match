"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { notifications, type NotificationCode } from "@/lib/notifications";

export function NotificationToast() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("notice") as NotificationCode | null;
  const notification = code ? notifications[code] : undefined;
  const [visible, setVisible] = useState(Boolean(notification));

  useEffect(() => setVisible(Boolean(notification)), [code, notification]);

  if (!notification || !visible) return null;

  function dismiss() {
    setVisible(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("notice");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return <div className={`notification-toast notification-toast-${notification.type}`} role={notification.type === "error" ? "alert" : "status"}>
    <span>{notification.message}</span>
    <button type="button" onClick={dismiss} aria-label="通知を閉じる">×</button>
  </div>;
}
