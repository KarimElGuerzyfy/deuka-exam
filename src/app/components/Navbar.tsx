import Image from "next/image";

interface NavbarProps {
  initials?: string;
}

export default function Navbar({ initials = "DR" }: NavbarProps) {
  return (
    <nav className="flex h-[50px] items-center justify-between bg-white px-[calc(12px+clamp(20px,3.5vw,32px))] py-3 md:px-[calc(24px+clamp(20px,3.5vw,32px))] lg:px-16">
      <Image
        src="/logo.svg"
        alt="Deuka"
        width={146}
        height={30}
        className="h-[18px] w-auto"
        priority
      />

      <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[var(--ink)] text-xs font-bold text-[#D9D9D9]">
        {initials}
      </div>
    </nav>
  );
}