import { Pannellum } from "pannellum-react";

interface Viewer360Props {
  imageUrl: string;
  title: string;
}

export const Viewer360 = ({ imageUrl, title }: Viewer360Props) => {
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-large">
      <Pannellum
        width="100%"
        height="100%"
        image={imageUrl}
        pitch={0}
        yaw={180}
        hfov={110}
        autoLoad
        showZoomCtrl={true}
        mouseZoom={true}
        showFullscreenCtrl={true}
        title={title}
      />
    </div>
  );
};
