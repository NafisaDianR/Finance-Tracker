import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="file:///D:/Semester6/Pemro/final%20project/LogoWarna.svg"
      fillRule="evenodd"
      clipRule="evenodd"
      className={cn("h-8 w-8", className)}
      {...props}
    >
      <path
        d="M16.03 2.13C10.3 2.13 5.76 6.3 5.76 12.33v15.54h4.75V17.87h5.17v-4.75h-5.17v-3.1c0-1.1.9-2 2-2h3.55V2.13h-5.12z"
        className="fill-primary"
      />
      <path
        d="M29.9 12.98c0-1.92-1.55-3.47-3.47-3.47h-9.9v18.36h4.75V18.5h4.68c1.92 0 3.47-1.55 3.47-3.47v-2.05z"
        className="fill-accent"
      />
    </svg>
  );
}
