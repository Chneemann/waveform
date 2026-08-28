/**
 * @file app/(app)/layout.tsx
 * @description Layout component providing a full-screen flex container with overflow clipping for application sub-routes.
 */
/**

* App group layout wrapper component.
*
* @param {Object} props - The component props.
* @param {React.ReactNode} props.children - The child elements to be rendered within the layout container.
* @returns {JSX.Element} The rendered layout container wrapping the child components.
*/

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen w-full overflow-hidden">{children}</div>;
}
