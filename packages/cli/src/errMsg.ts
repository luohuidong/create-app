export function errMsg(err: unknown): string | undefined {
  if (!err) return;

  if (typeof err === "string") return err;

  if (typeof err === "object") {
    return (err as Error).message;
  }

  return "";
}
