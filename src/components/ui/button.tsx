import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-dark disabled:opacity-40",
  secondary:
    "border border-border text-ink hover:bg-surface-dim disabled:opacity-50",
  ghost:
    "text-muted hover:text-ink",
  danger:
    "text-danger hover:underline",
};

const sizeStyles = {
  default: "py-3.5 px-4 text-sm font-medium",
  sm: "py-2 px-3 text-xs font-medium",
};

interface BaseProps {
  variant?: Variant;
  size?: keyof typeof sizeStyles;
  fullWidth?: boolean;
  className?: string;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkButtonProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    disabled?: never;
  };

export function Button(props: ButtonProps | LinkButtonProps) {
  const {
    variant = "primary",
    size = "default",
    fullWidth = false,
    className = "",
    ...rest
  } = props;

  const classes = [
    "rounded-xl transition-colors text-center inline-block",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as LinkButtonProps;
    return (
      <Link href={href} className={classes} {...anchorRest} />
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button className={classes} {...buttonRest} />;
}
