import Image from "next/image";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";

interface ImageProps {
  id: number;
  src: {
    medium: string;
    large: string;
  };
  photographer: string;
  photographer_url: string;
  title?: string;
}

const ImageCard: React.FC<ImageProps> = ({
  id,
  src,
  photographer,
  photographer_url,
  title,
}) => {
  return (
    <div className="group relative" key={id}>
      <Image
        src={src.large}
        alt={title || photographer}
        width={400}
        height={400}
        className="rounded-lg"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={photographer_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="mb-3 font-normal text-white dark:text-white">
                  {photographer}
                </p>
              </a>
            </TooltipTrigger>
            <TooltipContent
              style={{
                backgroundColor: "white",
                color: "black",
                padding: "6px",
                borderRadius: "8px",
              }}
            >
              <a
                href={photographer_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "black" }}
              >
                <p>Visit profile</p>
              </a>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ImageCard;
