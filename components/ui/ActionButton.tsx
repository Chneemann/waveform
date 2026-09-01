/**
 * @file components/ui/ActionButton.tsx
 * @description Flexible and reusable action button component supporting various variants, sizes, icons, and loading states.
 */

import { ButtonHTMLAttributes, ComponentType, ReactNode } from "react";
import { Loader2, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Available color and size type definitions for the ActionButton component.
 *
 * @type {ButtonVariant} ButtonStyle variants ("primary" | "secondary" | "danger").
 * @type {ButtonSize} Sizing options ("sm" | "md" | "lg").
 */
type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

/**
 * Properties for the ActionButton component.
 *
 * @interface ActionButtonProps
 * @extends {ButtonHTMLAttributes<HTMLButtonElement>}
 * @property {ButtonVariant} [variant="primary"] - The visual style variant of the button.
 * @property {ButtonSize} [size="md"] - The size dimension of the button.
 * @property {boolean} [isLoading=false] - Whether the button is in a loading state, displaying a spinner and disabling interactions.
 * @property {ComponentType<LucideProps>} [icon] - Optional Lucide icon component to render alongside text or independently.
 * @property {ReactNode} [children] - The content/text displayed inside the button.
 */
interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ComponentType<LucideProps>;
  children?: ReactNode;
}

const baseStyles =
  "font-medium transition-all duration-200 flex items-center justify-center cursor-pointer select-none shrink-0 " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent hover:bg-accent/90 text-white shadow-md shadow-accent/20 border border-accent/20 hover:shadow-lg hover:shadow-accent/25",
  secondary:
    "bg-surface-hover hover:bg-surface/90 text-slate-200 hover:text-white border border-white/10 hover:border-white/25 shadow-sm hover:shadow-md",
  danger:
    "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/30 shadow-sm hover:shadow-rose-500/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-5 py-2.5 text-base rounded-xl gap-2.5",
};

const iconSizes: Record<ButtonSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

/**
 * Renders a customizable action button with support for loading indicators, icons, and multiple size/variant styles.
 *
 * @param {ActionButtonProps} props - The component props.
 * @param {ButtonVariant} [props.variant="primary"] - The visual style variant of the button.
 * @param {ButtonSize} [props.size="md"] - The size dimension of the button.
 * @param {boolean} [props.isLoading=false] - Whether the button is in a loading state.
 * @param {ComponentType<LucideProps>} [props.icon] - Optional icon component to render.
 * @param {ReactNode} [props.children] - The button content.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {string} [props.className] - Additional custom CSS classes.
 * @returns {JSX.Element} The rendered action button component.
 */
export function ActionButton({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon: Icon,
  children,
  disabled,
  className,
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSizes[size], "animate-spin shrink-0")} />
      ) : (
        Icon && <Icon className={cn(iconSizes[size], "shrink-0")} />
      )}
      {children && <span>{children}</span>}
    </button>
  );
}
