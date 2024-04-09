/* eslint-disable @next/next/no-img-element */
import {
  getPresignedUrl,
  getUploadURL,
  getUrlFromUploadUrl,
} from "@/lib/s3Utils";
import axios from "axios";
import { useState } from "react";

interface SampleS3ImageProps {}
const SampleS3Image: React.FC<SampleS3ImageProps> = ({}) => {
  const [imageUrl, setImageUrl] = useState<string>();
  return (
    <div>
      <input
        type="file"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (file) {
            const uploadUrl = await getUploadURL({ key: file.name });
            await axios.put(uploadUrl, file);
            const fileUrl = getUrlFromUploadUrl(uploadUrl);
            const presignedUrl = await getPresignedUrl(fileUrl);
            console.log({ fileUrl });
            console.log({ presignedUrl });
            setImageUrl(presignedUrl);
          }
        }}
      />
      {imageUrl && <img src={imageUrl} alt="image url" width={400} />}
    </div>
  );
};
export default SampleS3Image;
