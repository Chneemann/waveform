/**
 * @file app/(auth)/layout.tsx
 * @description Layout component wrapping authentication views with a centered container structure and fixed bottom footer.
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
