import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

type Props = {
  initialImageUrl: string;
};

const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchImage().then((newImage) => {
      setImageUrl(newImage.url);
      setLoading(false);
    })
  }, []);
  const handleClick = async () => {
    setLoading(true);
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  }
  return (
    <div>
      <button onClick={handleClick}>他のにゃんこも見る</button>
      {loading || <img width="500" height="500" src={imageUrl} />}
    </div>
  );
}

export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};

type Image = {
  url: string
}

// ユーザ定義型ガード関数
const isImage = (value: unknown): value is Image => {
  // 値がオブジェクトかどうか
  if (!value || typeof value !== "object") {
    return false;
  }

  // urlプロパティを持ち、かつ、urlプロパティがstring型かどうか
  return "url" in value && typeof value.url === "string";
}

// fetchImageの戻り値をPromise<Image>として型注釈
const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images: unknown = await res.json();

  // 配列として表現されているか？
  if (!Array.isArray(images)) {
    throw new Error("猫の画像が取得できませんでした");
  }

  const image: unknown = images[0];

  // Imageの構造をなしているか？
  if (!isImage(image)) {
    throw new Error("猫の画像が取得できませんでした");
  }
  console.log(image);
  return image;
}

// fetchImage().then((image) => {
  // console.log(image.alt); // プロパティ 'alt' は型 'Image' に存在しません。
// });