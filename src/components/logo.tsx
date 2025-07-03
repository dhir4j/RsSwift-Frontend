import Image from 'next/image';

export default function Logo() {
  return (
    <>
      <Image
        src="/images/rsswift_light.png"
        alt="RS SWIFT COURIERS Logo"
        width={140}
        height={22}
        className="dark:hidden"
        priority
      />
      <Image
        src="/images/rsswift_dark.png"
        alt="RS SWIFT COURIERS Logo"
        width={140}
        height={22}
        className="hidden dark:block"
        priority
      />
    </>
  );
}
