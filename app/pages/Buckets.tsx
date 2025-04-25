import { BucketCard } from '@app/features/buckets/BucketCard';

const BUCKETS = [
  {
    id: 1,
    title: 'Software Engineer',
    description:
      'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit.',
    levels: ['Lvl1', 'Lvl2', 'Lvl3'],
  },
  {
    id: 2,
    title: 'Blockchain Developer',
    description:
      'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit.',
    levels: ['Lvl1', 'Lvl2', 'Lvl3'],
  },
  {
    id: 3,
    title: 'Machine Learning Engineer',
    description:
      'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit.',
    levels: ['Lvl1', 'Lvl2', 'Lvl3'],
  },
  {
    id: 4,
    title: 'AI ML Engineer',
    description:
      'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit.',
    levels: ['Lvl1', 'Lvl2', 'Lvl3'],
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    description:
      'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit.',
    levels: ['Lvl1', 'Lvl2', 'Lvl3'],
  },
  {
    id: 6,
    title: 'QA Testing Engineer',
    description:
      'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit.',
    levels: ['Lvl1', 'Lvl2', 'Lvl3'],
  },
];

export const Buckets = () => {
  return (
    <div>
      <p>Buckets</p>
      {BUCKETS.map((bucket) => (
        <BucketCard bucket={bucket} key={bucket.id} />
      ))}
    </div>
  );
};
