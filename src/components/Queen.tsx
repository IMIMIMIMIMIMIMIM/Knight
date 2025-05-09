type QueenProps = {
  color: string;
};

const Queen = ({ color }: QueenProps) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className={`text-2xl absolute ${color}`}>♛</div>
    </div>
  );
};

export default Queen;
