import { useParams } from 'react-router-dom';

export const BucketDetail = () => {
  let params = useParams();
  console.log(params);

  return (
    <div>
      <p>Bucket Detail</p>
      <p>{params.id}</p>
    </div>
  );
};
