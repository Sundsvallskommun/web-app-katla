interface MobilePageProps {
  open: boolean;
  setOpen?: (state: boolean) => void;
  header?: React.ReactNode;
  children?: React.ReactNode;
}

export const MobilePage: React.FC<MobilePageProps> = ({ open, header, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-vattjom-background-200 flex flex-col">
      {header && (
        <div className="flex h-[7rem] p-[1.6rem] gap-[1.2rem] items-center flex-shrink-0 self-stretch bg-vattjom-background-200 shadow-100 relative z-10">
          {header}
        </div>
      )}
      <div className="flex-1 overflow-auto bg-vattjom-background-200">{children}</div>
    </div>
  );
};
