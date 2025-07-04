import Image from 'next/image';

export default function Logo() {
  return (
    <Image
      src="/images/rsswift_logo.png"
      alt="RS SWIFT COURIERS Logo"
      width={140}
      height={22}
      priority
    />
  );
}
