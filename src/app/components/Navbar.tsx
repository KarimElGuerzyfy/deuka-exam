import Image from "next/image";

interface NavbarProps {
  initials?: string;
}

export default function Navbar({ initials = "DR" }: NavbarProps) {
  return (
    <nav
      style={{
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: "#FFFFFF",
      }}
    >
      <Image
        src="/logo.svg"
        alt="Deuka"
        width={146}
        height={30}
        style={{ height: 30, width: "auto" }}
        priority
      />

      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#050418",
          color: "#D9D9D9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 700,
          flex: "none",
        }}
      >
        {initials}
      </div>
    </nav>
  );
}