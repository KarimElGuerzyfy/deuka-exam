import Image from "next/image";

interface NavbarProps {
  initials?: string;
}

export default function Navbar({ initials = "DR" }: NavbarProps) {
  return (
    <nav className="flex h-[50px] items-center justify-between bg-white px-16 py-3">
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