import React, { ChangeEvent, use, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import path from "path";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { uploadState } from "@libs/client/atom";

//const chuckSize = 1e8; // 100MB
const chuckSize = 1e7;

interface IUploadInfo {
  uploadId: number;
  extension: string | undefined;
}

export default function MediaUploader({ type }: { type: "video" | "smi" }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<number>();
  const [uploadIndex, setUploadIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [isConnected, setIsConnected] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);

  const setUploadState = useSetRecoilState(uploadState);
  const uploadStateValue = useRecoilValue(uploadState);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadId(new Date().getTime());
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    setIsUploading((prev) => !prev);
  }, [uploadStateValue[type].isUploading]);

  useEffect(() => {
    if (file && isUploading) {
      //&& file.type.includes("video")
      if (file && uploadId) {
        const uploadInfo: IUploadInfo = {
          uploadId: uploadId,
          extension: path.extname(file.name),
        };
        socketRef.current?.emit("uploadStart", uploadInfo);
        fileSliceingAndUpload();
      }
    }
  }, [isUploading]);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!);
    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });
    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.disconnect();
      }
    };
  }, []);

  // next step
  useEffect(() => {
    if (file) {
      fileSliceingAndUpload();
      if (uploadIndex * chuckSize > file.size) {
        setUploadState((prev) => ({
          ...prev,
          [type]: {
            id: uploadId,
            isUploading: false,
          },
        }));
      }
    }
  }, [uploadIndex]);

  const plusUploadIndex = () => setUploadIndex((prev) => (prev += 1));

  const fileSliceingAndUpload = () => {
    if (file) {
      const blob = file.slice(
        uploadIndex * chuckSize, // from
        (uploadIndex + 1) * chuckSize, // to
      );
      socketRef.current?.emit("upload", blob, plusUploadIndex);
    }
  };

  return (
    <>
      <>
        {isConnected ? (
          <>
            <label
              htmlFor={type}
              className={`w-80 rounded-2xl px-5 py-3 text-center text-base font-bold text-white shadow-xl ${
                file ? "bg-blue-600" : "bg-stone-700"
              }`}
            >
              {file ? `${type} : ${file.name}` : `${type} upload`}
            </label>
            <input
              type="file"
              id={type}
              name={type}
              onChange={onChange}
              className="hidden"
            />
          </>
        ) : (
          <div className="w-80 rounded-2xl px-5 py-3.5 shadow-xl">
            <span>WS server not connect</span>
          </div>
        )}
        {isUploading ? (
          <div className="relative">
            <progress
              value={chuckSize * uploadIndex}
              max={file?.size}
              className="w-80 rounded-2xl bg-blue-200 px-5 py-3 shadow-xl"
            >
              0%
            </progress>
            <span className="absolute left-36">
              {chuckSize * uploadIndex}/{file?.size ? file?.size : "0"}
            </span>
          </div>
        ) : (
          ""
        )}
      </>
    </>
  );
}
