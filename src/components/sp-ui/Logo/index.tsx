import Link from 'next/link';

type Props = {
  url: string;
};

export const Logo = ({ url }: Props) => {
  return (
    <Link href={url} aria-label="Hey Buddy">
      <svg
        className="hidden fill-foreground md:block"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 512 100.2"
      >
        <g>
          <g>
            <path
              fill="#3B5DAA"
              d="M130,100.2H11.9C5.3,100.2,0,94.9,0,88.3V11.9C0,5.3,5.3,0,11.9,0H130c6.6,0,11.9,5.3,11.9,11.9v76.4
			C141.9,94.9,136.6,100.2,130,100.2z"
            />
            <path
              fill="#214696"
              d="M11.9,100.2H130c6.6,0,11.9-5.3,11.9-11.9V50.1H0v38.2C0,94.9,5.3,100.2,11.9,100.2z"
            />
            <g>
              <g>
                <path
                  fill="#FFFFFF"
                  d="M98.3,32.3v5.9H61.1l7.1-7.1c1.9-1.9,4.4-3,7.1-3h6.1v-6.8c0-0.5,0.4-0.9,0.9-0.9c0.2,0,0.5,0.1,0.6,0.3
					c0.2,0.2,0.3,0.4,0.3,0.6v6.8h4.2v-9.8c0-0.5,0.4-0.9,0.9-0.9c0.2,0,0.5,0.1,0.6,0.3c0.2,0.2,0.3,0.4,0.3,0.6v9.8h5.1
					C96.5,28.1,98.3,30,98.3,32.3z"
                />
              </g>
              <g>
                <path
                  fill="#FFFFFF"
                  d="M21.1,50c-0.9,0.3-1.7,0.9-2.4,1.6V40.8l8.3,3.1v3.9L21.1,50z"
                />
                <path
                  fill="#FFFFFF"
                  d="M21.1,62.1l5.9,2.2v3l-8.3,3.8V60.5C19.4,61.2,20.2,61.7,21.1,62.1z"
                />
                <path fill="none" d="M18.7,40.8L18.7,40.8" />
              </g>
              <g>
                <path
                  fill="#FFFFFF"
                  d="M121.3,51H76.4c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9h44.2c-0.8-1.6-1.8-3.1-3.1-4.4
					c-3-3.1-7.1-4.8-11.5-4.8H54.7c-1.2,0-2.4,0.2-3.5,0.6L28.8,49L27,49.7l-5.3,2l0,0l0,0c-1.8,0.7-3,2.4-3,4.4
					c0,1.9,1.2,3.7,3,4.4l0,0l0,0l5.3,2l1.8,0.7l22.4,8.4c1.1,0.4,2.3,0.6,3.5,0.6h51.2c4.3,0,8.3-1.6,11.3-4.6
					c3.1-3,4.8-6.9,4.9-11.1C122.1,54.5,121.9,52.7,121.3,51z M64.5,51H52.6c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9h11.9
					c0.5,0,0.9,0.4,0.9,0.9C65.4,50.6,65,51,64.5,51z M70.4,59c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9c0.5,0,0.9,0.4,0.9,0.9
					C71.3,58.6,70.9,59,70.4,59z M82.3,59c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9c0.5,0,0.9,0.4,0.9,0.9
					C83.2,58.6,82.8,59,82.3,59z M94.2,59c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9c0.5,0,0.9,0.4,0.9,0.9
					C95.1,58.6,94.7,59,94.2,59z M106.1,59c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9c0.5,0,0.9,0.4,0.9,0.9
					C107,58.6,106.6,59,106.1,59z"
                />
              </g>
            </g>
            <g>
              <path
                fill="#D6D6D6"
                d="M121.3,51H76.4c-0.5,0-0.9-0.4-0.9-0.9H65.4c0,0.5-0.4,0.9-0.9,0.9H52.6c-0.5,0-0.9-0.4-0.9-0.9H26l-4.2,1.6
				l0,0l0,0c-1.8,0.7-3,2.4-3,4.4c0,1.9,1.2,3.7,3,4.4l0,0l0,0l5.3,2l1.8,0.7l22.4,8.4c1.1,0.4,2.3,0.6,3.5,0.6h51.2
				c4.3,0,8.3-1.6,11.3-4.6c3.1-3,4.8-6.9,4.9-11.1C122.1,54.5,121.9,52.7,121.3,51z M70.4,59c-0.5,0-0.9-0.4-0.9-0.9
				c0-0.5,0.4-0.9,0.9-0.9c0.5,0,0.9,0.4,0.9,0.9C71.3,58.6,70.9,59,70.4,59z M82.3,59c-0.5,0-0.9-0.4-0.9-0.9
				c0-0.5,0.4-0.9,0.9-0.9c0.5,0,0.9,0.4,0.9,0.9C83.2,58.6,82.8,59,82.3,59z M94.2,59c-0.5,0-0.9-0.4-0.9-0.9
				c0-0.5,0.4-0.9,0.9-0.9c0.5,0,0.9,0.4,0.9,0.9C95.1,58.6,94.7,59,94.2,59z M106.1,59c-0.5,0-0.9-0.4-0.9-0.9
				c0-0.5,0.4-0.9,0.9-0.9c0.5,0,0.9,0.4,0.9,0.9C107,58.6,106.6,59,106.1,59z"
              />
            </g>
            <path
              fill="#D6D6D6"
              d="M21.1,62.1c-0.9-0.3-1.7-0.9-2.4-1.6v10.6l8.3-3.8v-3L21.1,62.1z"
            />
            <path
              fill="#D6D6D6"
              d="M18.7,40.8v10.8c0.7-0.7,1.5-1.2,2.4-1.6l5.9-2.2v-3.9L18.7,40.8z"
            />
            <path
              fill="#D6D6D6"
              d="M94.2,28.1H75.3c-2.7,0-5.2,1.1-7.1,3l-7.1,7.1h37.3v-5.9C98.3,30,96.5,28.1,94.2,28.1z"
            />
          </g>
          <g>
            <path d="M294.2,33.7h-0.3c0.1,0,0.1,0,0.2,0C294.1,33.7,294.2,33.7,294.2,33.7z" />
            <path
              d="M345.8,12.5h-30.6v75.1h11.7V55.9h18.9c6.5,0,11.7-5.2,11.7-11.7v-20C357.5,17.8,352.3,12.5,345.8,12.5z
			 M345.8,41.6c0,1.4-1.2,2.6-2.6,2.6h-16.3v-20h16.3c1.4,0,2.6,1.2,2.6,2.6V41.6z"
            />
            <path
              d="M449.5,33.7h-19.1v0h-11.7v54h11.7V66.5h19c4.3,0,8-2.4,10-5.8v0c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0,0
			c0.1-0.1,0.1-0.2,0.2-0.3c0.1-0.1,0.1-0.2,0.2-0.3c0-0.1,0.1-0.1,0.1-0.2c0-0.1,0.1-0.1,0.1-0.2c0-0.1,0.1-0.1,0.1-0.2
			c0-0.1,0.1-0.2,0.1-0.3c0-0.1,0-0.1,0.1-0.2c0.1-0.2,0.1-0.4,0.2-0.6c0-0.1,0-0.1,0.1-0.2c0-0.1,0-0.1,0.1-0.2
			c0-0.1,0.1-0.3,0.1-0.4c0-0.2,0.1-0.3,0.1-0.5c0-0.1,0-0.1,0-0.2c0-0.1,0-0.1,0-0.2c0-0.1,0-0.1,0-0.2c0,0,0-0.1,0-0.1
			c0,0,0-0.1,0-0.1c0,0,0,0,0,0c0,0,0-0.1,0-0.1c0-0.2,0-0.4,0-0.6c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.1c0-0.1,0-0.1,0-0.2
			c0-0.1,0-0.1,0-0.2v-9.5C461.1,39,455.9,33.8,449.5,33.7z M449.4,52.2c0,1.4-1.2,2.6-2.6,2.6h-16.3v-9.5h16.3
			c1.4,0,2.6,1.2,2.6,2.6V52.2z"
            />
            <path d="M449.5,66.5c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0H449.5z" />
            <path d="M459.8,60.2c-0.1,0.1-0.1,0.2-0.2,0.3C459.7,60.4,459.7,60.3,459.8,60.2z" />
            <path d="M446.8,54.8C446.8,54.8,446.8,54.8,446.8,54.8l-16.4,0v0H446.8z" />
            <polygon points="512,33.7 512,45.4 496.7,45.4 496.7,87.7 485,87.7 485,45.4 470.4,45.4 470.4,33.7 		" />
            <path
              d="M254,33.7V76c0,6.5-5.2,11.7-11.7,11.7h-18.9c-6.5,0-11.7-5.2-11.7-11.7V33.7h11.7v39.7
			c0,1.4,1.2,2.6,2.6,2.6h13.7c1.4,0,2.6-1.2,2.6-2.6V33.7H254z"
            />
            <path
              d="M397.6,33.7h-18.9c-6.5,0-11.7,5.2-11.7,11.7V76c0,6.5,5.2,11.7,11.7,11.7h18.9c6.5,0,11.7-5.2,11.7-11.7
			V45.4C409.3,38.9,404.1,33.7,397.6,33.7z M397.6,73.4c0,1.4-1.2,2.6-2.6,2.6h-13.7c-1.4,0-2.6-1.2-2.6-2.6V48
			c0-1.4,1.2-2.6,2.6-2.6H395c1.4,0,2.6,1.2,2.6,2.6V73.4z"
            />
            <path
              d="M190.5,33.7v-6.9c0-1.4-1.2-2.6-2.6-2.6h-13.7c-1.4,0-2.6,1.2-2.6,2.6v12.7c0,1.2,0.8,2.2,1.9,2.5l17,4.6
			l3,0.8c5.1,1.4,8.7,6,8.7,11.3V76c0,6.5-5.2,11.7-11.7,11.7h-18.9c-6.5,0-11.7-5.2-11.7-11.7v-9.5h11.7v6.9c0,1.4,1.2,2.6,2.6,2.6
			h13.7c1.4,0,2.6-1.2,2.6-2.6V60.7c0-1.2-0.8-2.2-1.9-2.5l-17-4.6l-3-0.8c-5.1-1.4-8.7-6-8.7-11.3V24.2c0-6.5,5.2-11.7,11.7-11.7
			h18.9c6.5,0,11.7,5.2,11.7,11.7v9.5H190.5z"
            />
            <path
              d="M305.8,45.4c0-3.2-1.3-6.1-3.4-8.3c-2.1-2.1-5-3.4-8.3-3.4h-30.6v54h30.6c3.2,0,6.1-1.3,8.3-3.4
			c2.1-2.1,3.4-5,3.4-8.3v-9.5c0-2.1-0.6-4.1-1.6-5.8c1-1.7,1.6-3.7,1.6-5.8V45.4z M294.1,73.4c0,1.4-1.2,2.6-2.6,2.6h-16.3v-9.5
			h16.3c1.4,0,2.6,1.2,2.6,2.6V73.4z M294.1,52.2c0,1.4-1.2,2.6-2.6,2.6h-16.3v-9.5h16.3c1.4,0,2.6,1.2,2.6,2.6V52.2z"
            />
          </g>
        </g>
      </svg>

      <svg
        className="block md:hidden"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 279.9 197.6"
      >
        <g id="SubBack">
          <path
            fill="#3B5DAA"
            d="M256.5,197.6h-233C10.5,197.6,0,187.1,0,174.2V23.4C0,10.5,10.5,0,23.4,0h233c12.9,0,23.4,10.5,23.4,23.4
		v150.7C279.9,187.1,269.4,197.6,256.5,197.6z"
          />
          <path
            fill="#214696"
            d="M23.4,197.6h233c12.9,0,23.4-10.5,23.4-23.4V98.8H0v75.4C0,187.1,10.5,197.6,23.4,197.6z"
          />
        </g>
        <g id="Sub">
          <g>
            <g>
              <path
                fill="#FFFFFF"
                d="M194,63.7v11.7h-73.6l14.1-14.1c3.8-3.8,8.8-5.8,14.1-5.8h12V42c0-1,0.8-1.8,1.8-1.8c0.5,0,0.9,0.2,1.2,0.5
				c0.3,0.3,0.5,0.8,0.5,1.2v13.5h8.2V36.1c0-1,0.8-1.8,1.8-1.8c0.5,0,0.9,0.2,1.2,0.5c0.3,0.3,0.5,0.8,0.5,1.2v19.3h10
				C190.3,55.4,194,59.1,194,63.7z"
              />
            </g>
            <g>
              <path
                fill="#FFFFFF"
                d="M41.7,98.6c-1.8,0.7-3.4,1.7-4.8,3.1V80.4l16.4,6.2v7.7L41.7,98.6z"
              />
              <path
                fill="#FFFFFF"
                d="M41.7,122.4l11.7,4.4v6l-16.4,7.5v-20.9C38.2,120.7,39.9,121.8,41.7,122.4z"
              />
              <path fill="none" d="M36.9,80.4L36.9,80.4" />
            </g>
            <g>
              <path
                fill="#FFFFFF"
                d="M239.3,100.6h-88.7c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8h87.3c-1.5-3.2-3.5-6.1-6-8.7
				c-6-6.1-14-9.5-22.6-9.5H108c-2.4,0-4.8,0.4-7,1.3L56.8,96.7L53.3,98l-10.4,3.9l0,0l0,0c-3.6,1.3-6,4.8-6,8.6
				c0,3.8,2.4,7.3,6,8.6l0,0l0,0l10.4,3.9l3.5,1.3l44.1,16.6c2.2,0.8,4.6,1.3,7,1.3h100.9c8.4,0,16.3-3.2,22.3-9
				c6-5.8,9.5-13.6,9.6-22C240.9,107.5,240.4,103.9,239.3,100.6z M127.2,100.6h-23.4c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8h23.4
				c1,0,1.8,0.8,1.8,1.8C128.9,99.8,128.1,100.6,127.2,100.6z M138.9,116.4c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8
				c1,0,1.8,0.8,1.8,1.8C140.7,115.6,139.9,116.4,138.9,116.4z M162.3,116.4c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8
				c1,0,1.8,0.8,1.8,1.8C164.1,115.6,163.3,116.4,162.3,116.4z M185.8,116.4c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8
				c1,0,1.8,0.8,1.8,1.8C187.5,115.6,186.7,116.4,185.8,116.4z M209.2,116.4c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8
				c1,0,1.8,0.8,1.8,1.8C211,115.6,210.2,116.4,209.2,116.4z"
              />
            </g>
          </g>
          <g>
            <path
              fill="#D6D6D6"
              d="M239.3,100.6h-88.7c-1,0-1.8-0.8-1.8-1.8h-19.9c0,1-0.8,1.8-1.8,1.8h-23.4c-1,0-1.8-0.8-1.8-1.8H51.2
			l-8.3,3.1l0,0l0,0c-3.6,1.3-6,4.8-6,8.6c0,3.8,2.4,7.3,6,8.6l0,0l0,0l10.4,3.9l3.5,1.3l44.1,16.6c2.2,0.8,4.6,1.3,7,1.3h100.9
			c8.4,0,16.3-3.2,22.3-9c6-5.8,9.5-13.6,9.6-22C240.9,107.5,240.4,103.9,239.3,100.6z M138.9,116.4c-1,0-1.8-0.8-1.8-1.8
			c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8C140.7,115.6,139.9,116.4,138.9,116.4z M162.3,116.4c-1,0-1.8-0.8-1.8-1.8
			c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8C164.1,115.6,163.3,116.4,162.3,116.4z M185.8,116.4c-1,0-1.8-0.8-1.8-1.8
			c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8C187.5,115.6,186.8,116.4,185.8,116.4z M209.2,116.4c-1,0-1.8-0.8-1.8-1.8
			c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8C211,115.6,210.2,116.4,209.2,116.4z"
            />
          </g>
          <path
            fill="#D6D6D6"
            d="M41.7,122.4c-1.8-0.7-3.4-1.7-4.8-3.1v20.9l16.4-7.5v-6L41.7,122.4z"
          />
          <path
            fill="#D6D6D6"
            d="M36.9,80.4v21.3c1.3-1.4,2.9-2.5,4.8-3.1l11.7-4.4v-7.7L36.9,80.4z"
          />
          <path
            fill="#D6D6D6"
            d="M185.8,55.4h-37.2c-5.3,0-10.3,2.1-14.1,5.8l-14.1,14.1H194V63.6C194,59.1,190.3,55.4,185.8,55.4z"
          />
        </g>
      </svg>
    </Link>
  );
};

export const IconLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 1200 846.2"
    >
      <rect fill="#3b5daa" width="1200" height="847.2" rx="100.5" ry="100.5" />
      <path
        fill="#214696"
        d="M0,423.6h1200v323.1c0,55.5-45,100.5-100.5,100.5H100.5c-55.5,0-100.5-45-100.5-100.5v-323.1h0Z"
      />
      <g>
        <path
          fill="#ffffff"
          d="M831.7,272.9v50.2h-315.4l60.4-60.4c16.1-16.1,37.6-25,60.4-25h51.3v-57.8c0-4.2,3.4-7.5,7.5-7.5s4,.8,5.3,2.2c1.4,1.4,2.2,3.2,2.2,5.3v57.8h35.2v-82.9c0-4.2,3.4-7.5,7.5-7.5s4,.8,5.3,2.2c1.4,1.4,2.2,3.2,2.2,5.3v82.9h42.7c19.4,0,35.2,15.8,35.2,35.2Z"
        />
        <g>
          <path
            fill="#ffffff"
            d="M178.7,422.9c-7.8,2.9-14.8,7.5-20.4,13.4v-91.4l70.4,26.4v32.9l-50,18.7Z"
          />
          <path
            fill="#ffffff"
            d="M178.7,524.9l50,18.7v25.6l-70.4,32v-89.7c5.6,5.9,12.6,10.5,20.4,13.4Z"
          />
          <path fill="none" d="M158.3,344.8h0" />
        </g>
        <path
          fill="#ffffff"
          d="M1025.8,431.2h-380.1c-4.2,0-7.5-3.4-7.5-7.5s3.4-7.5,7.5-7.5h374.1c-6.4-13.6-15.1-26.1-25.9-37.2-25.7-26.3-60.2-40.7-96.9-40.7h-434c-10.3,0-20.4,1.8-30,5.4l-189.2,71-15.1,5.6-44.7,16.8h0s0,0,0,0c-15.3,5.6-25.6,20.4-25.6,36.8s10.3,31.2,25.6,36.8h0s0,0,0,0l44.7,16.8,15.1,5.6,189.2,71c9.6,3.6,19.7,5.4,30,5.4h432.6c36,0,70-13.7,95.8-38.7,25.9-25,40.5-58.4,41.2-94.1.3-15.7-2-31.1-6.8-45.5ZM545.2,431.2h-100.5c-4.2,0-7.5-3.4-7.5-7.5s3.4-7.5,7.5-7.5h100.5c4.2,0,7.5,3.4,7.5,7.5s-3.4,7.5-7.5,7.5ZM595.5,499c-4.2,0-7.5-3.4-7.5-7.5s3.4-7.5,7.5-7.5,7.5,3.4,7.5,7.5-3.4,7.5-7.5,7.5ZM696,499c-4.2,0-7.5-3.4-7.5-7.5s3.4-7.5,7.5-7.5,7.5,3.4,7.5,7.5-3.4,7.5-7.5,7.5ZM796.5,499c-4.2,0-7.5-3.4-7.5-7.5s3.4-7.5,7.5-7.5,7.5,3.4,7.5,7.5-3.4,7.5-7.5,7.5ZM897,499c-4.2,0-7.5-3.4-7.5-7.5s3.4-7.5,7.5-7.5,7.5,3.4,7.5,7.5-3.4,7.5-7.5,7.5Z"
        />
      </g>
      <path
        fill="#d6d6d6"
        d="M1025.9,431.2h-380.1c-4.2,0-7.5-3.4-7.5-7.5h-85.4c0,4.2-3.4,7.5-7.5,7.5h-100.5c-4.2,0-7.5-3.4-7.5-7.5h-217.6l-35.7,13.4h0s0,0,0,0c-15.3,5.6-25.6,20.4-25.6,36.8s10.3,31.2,25.6,36.8h0s0,0,0,0l44.7,16.8,15.1,5.6,189.2,71c9.6,3.6,19.7,5.4,30,5.4h432.6c36,0,70-13.7,95.8-38.7,25.9-25,40.5-58.4,41.2-94.1.3-15.7-2-31.1-6.8-45.5ZM595.5,499c-4.2,0-7.5-3.4-7.5-7.5s3.4-7.5,7.5-7.5,7.5,3.4,7.5,7.5-3.4,7.5-7.5,7.5ZM696,499c-4.2,0-7.5-3.4-7.5-7.5s3.4-7.5,7.5-7.5,7.5,3.4,7.5,7.5-3.4,7.5-7.5,7.5ZM796.5,499c-4.2,0-7.5-3.4-7.5-7.5s3.4-7.5,7.5-7.5,7.5,3.4,7.5,7.5-3.4,7.5-7.5,7.5ZM897,499c-4.2,0-7.5-3.4-7.5-7.5s3.4-7.5,7.5-7.5,7.5,3.4,7.5,7.5-3.4,7.5-7.5,7.5Z"
      />
      <path
        fill="#d6d6d6"
        d="M178.7,524.9c-7.8-2.9-14.8-7.5-20.4-13.4v89.7l70.4-32v-25.6l-50-18.7Z"
      />
      <path
        fill="#d6d6d6"
        d="M158.3,344.9v91.4c5.6-5.9,12.6-10.5,20.4-13.4l50-18.7v-32.9l-70.4-26.4Z"
      />
      <path
        fill="#d6d6d6"
        d="M796.5,237.7h-159.4c-22.8,0-44.3,8.9-60.4,25l-60.4,60.4h315.4v-50.3c0-19.4-15.8-35.2-35.2-35.2Z"
      />
    </svg>

    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   x="0px"
    //   y="0px"
    //   className="fill-foreground"
    //   viewBox="0 0 512 242.5"
    // >
    //   <g>
    //     <path
    //       fill="#3b5daa"
    //       d="M443.4,150.7c0,48.4-39.2,87.6-87.6,87.6H92.9c-42.1,0-77.2-29.7-85.7-69.2h55.3c11.2,0,21.6-3.3,30.4-9,15.3-10,25.4-27.2,25.4-46.8v-49.6c0-.2,0-.4,0-.6h237.5c48.4,0,87.6,39.2,87.6,87.6Z"
    //     />
    //     <path
    //       fill="#f47c20"
    //       d="M114.8,60.2c1.9,0,3.5,1.6,3.5,3.5v49.6c0,19.6-10.1,36.8-25.4,46.8-8.8,5.7-19.2,9-30.4,9H7.2c-1.7,0-3.2-1.2-3.5-2.9-.9-5-1.3-10.2-1.3-15.5s0,0,0,0c0-1.1.9-2,2-2h58.1c12.9,0,24.2-7,30.4-17.3,3.2-5.3,5-11.5,5-18.1v-49.6c0-1.9,1.6-3.5,3.5-3.5h13.4Z"
    //     />
    //     <path
    //       fill="#3b5daa"
    //       d="M478,143.4v14.6h-9.8c.1-2.4.2-4.9.2-7.3s0-4.9-.2-7.3h9.8Z"
    //     />
    //     <path
    //       fill="#f47c20"
    //       d="M458.4,150.7c0,9.1-.9,18-2.5,26.6,0,0,0,.1,0,.2-1.7,8.2-8.9,14.2-17.3,14.2h-5.2c2.2-4.2,4.1-8.7,5.7-13.3,2.9-8.7,4.4-18,4.4-27.6s-1.6-18.9-4.4-27.6c-1.5-4.6-3.4-9-5.7-13.3h5.2c8.4,0,15.7,5.9,17.3,14.2,0,0,0,.1,0,.2,1.7,8.6,2.5,17.5,2.5,26.6Z"
    //     />
    //     <path
    //       fill="#f47c20"
    //       d="M468.3,150.7c0,3.8-.2,7.6-.4,11.3-.6,7.3-5.5,13.3-12,15.5,0,0,0-.1,0-.2,1.7-8.6,2.5-17.5,2.5-26.6s-.9-18-2.5-26.6c0,0,0-.1,0-.2,6.6,2.2,11.5,8.2,12,15.5.3,3.7.4,7.5.4,11.3Z"
    //     />
    //     <path
    //       fill="#3b5daa"
    //       d="M480.9,137.6h11.1c7.3,0,13.2,5.9,13.2,13.2h0c0,7.3-5.9,13.2-13.2,13.2h-11.1c-1.6,0-2.9-1.3-2.9-2.9v-20.5c0-1.6,1.3-2.9,2.9-2.9Z"
    //     />
    //     <path
    //       fill="#f47c20"
    //       d="M509.6,93.7c0,14.1-6.2,33.7-10.7,45.9-2-1.3-4.4-2-6.9-2h-1.7c-3.5-11.8-8-29.2-8-41.4s7.3-17.5,12.7-17.5c11.1,0,14.6,9.8,14.6,15Z"
    //     />
    //     <path
    //       fill="#f47c20"
    //       d="M498.4,205.3c0,7.1-2.1,11.6-4.8,14.3-2.4,2.3-5.4,3.2-7.9,3.2h0c-11.1,0-14.6-9.8-14.6-15,0-13.3,5.6-31.7,10-43.9h9.3c3.5,11.8,8,29.2,8,41.4Z"
    //     />
    //     <path
    //       fill="#3b5daa"
    //       d="M137.6,62.6l16.7-23.1c2.7-3.8,7.2-6.1,11.9-6.1h133.9c8.1,0,14.6,6.5,14.6,14.6v14.6h-177Z"
    //     />
    //     <path
    //       fill="#3b5daa"
    //       d="M289.4,14.2c0,4.1-1.7,7.9-4.4,10.6-2.7,2.8-6.5,4.5-10.7,4.5h-89.5l13.7-19c2.7-3.8,7.2-6.1,11.9-6.1h72.7c1.5,0,3,.2,4.4.7h-1.3c2,2.6,3.2,5.8,3.2,9.3Z"
    //     />
    //     <path
    //       fill="#53c9f2"
    //       d="M8.3,148.7h54.3c12.9,0,24.2-7,30.4-17.3,3.2-5.3,5-11.5,5-18.1v-47.3s-5,0-5,0c-46.1,0-83.6,36.8-84.7,82.7h0Z"
    //     />
    //     <circle fill="#f47c20" cx="178.8" cy="110.6" r="18.3" />
    //     <circle fill="#53c9f2" cx="178.8" cy="110.6" r="12.3" />
    //     <circle fill="#f47c20" cx="234.6" cy="110.6" r="18.3" />
    //     <circle fill="#53c9f2" cx="234.6" cy="110.6" r="12.3" />
    //     <circle fill="#f47c20" cx="290.3" cy="110.6" r="18.3" />
    //     <circle fill="#53c9f2" cx="290.3" cy="110.6" r="12.3" />
    //     <path
    //       fill="#f47c20"
    //       d="M314.6,48h-70.6c-8.1,0-14.6-6.5-14.6-14.6h70.6c8.1,0,14.6,6.5,14.6,14.6Z"
    //     />
    //   </g>
    //   <g>
    //     <path
    //       fill="#29427a"
    //       d="M297.6,18.8v14.6h-115.8l2.9-4.1h89.5c4.2,0,8-1.7,10.7-4.5,2.7-2.7,4.4-6.5,4.4-10.6s-1.2-6.8-3.2-9.3h1.3c5.9,1.9,10.2,7.4,10.2,13.9Z"
    //     />
    //     <path
    //       fill="#cb6528"
    //       d="M482.3,96.1c0,12.2,4.5,29.6,8,41.4h-8.8c-3.5-11.8-8-29.2-8-41.4s7.3-17.5,12.7-17.5h8.8c-5.4,0-12.7,4.1-12.7,17.5Z"
    //     />
    //     <path
    //       fill="#cb6528"
    //       d="M507.1,205.3c0,13.4-7.3,17.5-12.7,17.5h-8.8c2.5,0,5.5-.9,7.9-3.2,2.7-2.6,4.8-7.1,4.8-14.3,0-12.2-4.5-29.6-8-41.4h1.7c2.4,0,4.6-.6,6.6-1.8,3.6,11.8,8.6,30.3,8.6,43.2Z"
    //     />
    //     <path
    //       fill="#29427a"
    //       d="M439.8,150.7c0,46.3-37.7,84-84,84H92.9c-19.3,0-38.2-6.7-53.1-18.9-11.5-9.4-20.2-21.7-25.4-35.4-.8-2.1-2.8-3.5-5.1-3.5h0c-.8-2.5-1.5-5.1-2-7.8h55.3c11.2,0,21.6-3.3,30.4-9,15.3-10,25.4-27.2,25.4-46.8v-10h.8v21.2c0,2.2-.1,4.3-.4,6.4-3.2,25.9-24.7,45.9-51.4,45.9s-17.8,8-17.8,17.8,0,.3,0,.5c.3,9.7,8.5,17.3,18.2,17.3h300.6c.6,0,1.3,0,1.9,0h0c.6,0,1.2,0,1.7,0,26,0,48.7-14.7,60-36.2,4.6-8.7,7.3-18.4,7.8-28.8,0,1.1,0,2.1,0,3.2Z"
    //     />
    //     <path
    //       fill="#cb6528"
    //       d="M118.3,82.9v30.4c0,19.6-10.1,36.8-25.4,46.8-8.8,5.7-19.2,9-30.4,9H7.2c-1.7,0-3.2-1.2-3.5-2.9,0-.5-.2-1-.2-1.5h60.7c29.3,0,53.1-23.8,53.1-53.1v-28.7h1.1Z"
    //     />
    //     <path
    //       fill="#cb6528"
    //       d="M439.9,177.7h1.2c8.6,0,16.1-6.9,16.1-15.5v-3.5s1.3,2.4,1.3,2.4l-.7,10.8c-.7,9.7-8.7,17.2-18.4,17.2h-4.8l5.3-11.3Z"
    //     />
    //     <path
    //       fill="#cb6528"
    //       d="M457.1,174h.6l.5-4.5h0c4.4,0,8.7-3.5,8.8-7.9l.6-12.2,1.1,11.2-1.1.4c-.7,5.4-5.1,12.9-10.6,13Z"
    //     />
    //     <path
    //       fill="#29427a"
    //       d="M477.9,156.2h19.7c3.5,0,6.3-2.8,6.3-6.3h0s1,1.1,1,1.1v.3c0,4.9-3.9,8.8-8.8,8.8h-19.2l1-4Z"
    //     />
    //     <path fill="#29427a" d="M478,151.9v3h-9.7c0-1,0-2,0-3h9.7Z" />
    //     <path
    //       fill="#28427b"
    //       d="M197.1,112.3c0,10.1-8.2,18.3-18.3,18.3s-18.3-8.2-18.3-18.3,0-.4,0-.6c.3,9.8,8.4,17.7,18.3,17.7s18-7.9,18.3-17.7c0,.2,0,.4,0,.6Z"
    //     />
    //     <path
    //       fill="#cb6528"
    //       d="M196.2,110.9c-.2,9.4-7.9,17-17.4,17s-17.2-7.6-17.4-17c.2,8.1,7.9,14.7,17.4,14.7s17.1-6.5,17.4-14.7Z"
    //     />
    //     <path
    //       fill="#33abe2"
    //       d="M169.9,119c-2.1-2.2-3.4-5.2-3.4-8.5,0-6.8,5.5-12.3,12.3-12.3s6.3,1.3,8.5,3.4c-4.3-4.1-11.5-3.6-16.2,1.1-4.7,4.7-5.2,11.9-1.1,16.2Z"
    //     />
    //     <path
    //       fill="#33abe2"
    //       d="M191.1,110.6c0,6.8-5.5,12.3-12.3,12.3s-6.3-1.3-8.5-3.4c4.3,4.1,11.5,3.6,16.2-1.1s5.2-11.9,1.1-16.2c2.1,2.2,3.4,5.2,3.4,8.5Z"
    //     />
    //     <path
    //       fill="#28427b"
    //       d="M252.9,112.3c0,10.1-8.2,18.3-18.3,18.3s-18.3-8.2-18.3-18.3,0-.4,0-.6c.3,9.8,8.4,17.7,18.3,17.7s18-7.9,18.3-17.7c0,.2,0,.4,0,.6Z"
    //     />
    //     <path
    //       fill="#cb6528"
    //       d="M251.9,110.9c-.2,9.4-7.9,17-17.4,17s-17.2-7.6-17.4-17c.2,8.1,7.9,14.7,17.4,14.7s17.1-6.5,17.4-14.7Z"
    //     />
    //     <path
    //       fill="#33abe2"
    //       d="M225.7,119c-2.1-2.2-3.4-5.2-3.4-8.5,0-6.8,5.5-12.3,12.3-12.3s6.3,1.3,8.5,3.4c-4.3-4.1-11.5-3.6-16.2,1.1-4.7,4.7-5.2,11.9-1.1,16.2Z"
    //     />
    //     <path
    //       fill="#33abe2"
    //       d="M246.8,110.6c0,6.8-5.5,12.3-12.3,12.3s-6.3-1.3-8.5-3.4c4.3,4.1,11.5,3.6,16.2-1.1,4.7-4.7,5.2-11.9,1.1-16.2,2.1,2.2,3.4,5.2,3.4,8.5Z"
    //     />
    //     <path
    //       fill="#28427b"
    //       d="M308.7,112.3c0,10.1-8.2,18.3-18.3,18.3s-18.3-8.2-18.3-18.3,0-.4,0-.6c.3,9.8,8.4,17.7,18.3,17.7s18-7.9,18.3-17.7c0,.2,0,.4,0,.6Z"
    //     />
    //     <path
    //       fill="#cb6528"
    //       d="M307.7,110.9c-.2,9.4-7.9,17-17.4,17s-17.2-7.6-17.4-17c.2,8.1,7.9,14.7,17.4,14.7s17.1-6.5,17.4-14.7Z"
    //     />
    //     <path
    //       fill="#33abe2"
    //       d="M281.5,119c-2.1-2.2-3.4-5.2-3.4-8.5,0-6.8,5.5-12.3,12.3-12.3s6.3,1.3,8.5,3.4c-4.3-4.1-11.5-3.6-16.2,1.1-4.7,4.7-5.2,11.9-1.1,16.2Z"
    //     />
    //     <path
    //       fill="#33abe2"
    //       d="M302.6,110.6c0,6.8-5.5,12.3-12.3,12.3s-6.3-1.3-8.5-3.4c4.3,4.1,11.5,3.6,16.2-1.1,4.7-4.7,5.2-11.9,1.1-16.2,2.1,2.2,3.4,5.2,3.4,8.5Z"
    //     />
    //     <path
    //       fill="#10aee4"
    //       d="M9.2,137.7s4.4,4.4,20.4,4.4c59.5,0,67.4-44.5,67.4-44.5v16.5c0,19.2-15.5,34.7-34.7,34.7H8.3l1-11Z"
    //     />
    //     <path fill="#29427a" d="M304.7,34.1c0,0-.2,0-.3,0h0c0,0,.2,0,.2,0Z" />
    //     <path
    //       fill="#29427a"
    //       d="M308.7,36.3c-.4-.3-.8-.5-1.2-.8.4.2.8.5,1.2.8Z"
    //     />
    //     <path
    //       fill="#29427a"
    //       d="M312.1,39.8c-.3-.4-.5-.8-.8-1.1.3.4.6.7.8,1.1Z"
    //     />
    //     <path
    //       fill="#28427b"
    //       d="M314.6,48v14.6h-177l2.9-4.1h150.7c4.2,0,8-1.7,10.7-4.5,1.1-1.1,2-2.3,2.7-3.7h-60.6c-8.1,0-14.6-6.5-14.6-14.6h0c.6,7.5,6.9,12.3,14.6,12.3h61.2c.2-.4.3.4.4,0h8.9Z"
    //     />
    //     <polygon
    //       fill="#79a9d8"
    //       points="154.6 58.5 151.7 62.6 148.8 62.6 151.7 58.5 154.6 58.5"
    //     />
    //     <polygon
    //       fill="#79a9d8"
    //       points="175.1 58.5 172.1 62.6 157.5 62.6 160.5 58.5 175.1 58.5"
    //     />
    //     <polygon
    //       fill="#79a9d8"
    //       points="192.7 29.3 193.9 29.3 190.9 33.4 189.8 33.4 192.7 29.3"
    //     />
    //     <polygon
    //       fill="#79a9d8"
    //       points="210.2 29.3 207.3 33.4 195.6 33.4 198.5 29.3 210.2 29.3"
    //     />
    //     <path
    //       fill="#cb6528"
    //       d="M305.7,48c.5-1.4.7-3,.7-4.6,0-3.5-1.2-6.8-3.2-9.3h1.3c0,0,.2,0,.3,0,.1,0,.3,0,.4.1.2,0,.4.2.7.3.2,0,.4.2.6.3.2.1.4.2.6.3.2.1.4.2.6.3,0,0,0,0,0,0,.4.2.8.5,1.2.8s.4.3.6.4c.4.3.7.6,1,.9.2.2.3.3.5.5.2.2.3.4.5.5.3.4.6.7.8,1.1.1.2.2.4.4.6,0,0,0,0,0,0,.1.2.2.4.3.6.2.4.4.8.6,1.2,0,0,0,.2.1.3,0,.2.1.3.2.5,0,.2.1.4.2.6,0,0,0,0,0,.1.1.4.3.9.3,1.4,0,.2,0,.5.1.7,0,.2,0,.5,0,.7,0,0,0,0,0,0,0,.2,0,.4,0,.6,0,.3,0,.6,0,.9h-8.9Z"
    //     />
    //   </g>
    //   <g>
    //     <path
    //       fill="#fcc085"
    //       d="M457.9,139.4h-15.2c-.7-5.6-2-11.1-3.7-16.3,0-.2-.1-.4-.2-.6h16.7c.1.5.3,1,.4,1.5,0,0,0,.1,0,.2,1,5,1.7,10.1,2.1,15.2Z"
    //     />
    //     <path
    //       fill="#fcc085"
    //       d="M468.1,142.8h-9.9c-.2-3.7-.5-7.3-1-10.9h8.4c1.3,2.2,2.1,4.8,2.4,7.6,0,1.1.2,2.2.2,3.3Z"
    //     />
    //     <path
    //       fill="#a4b6de"
    //       d="M503.8,144.8h-25.8v-3h23.7c.8.9,1.5,1.9,2.1,3Z"
    //     />
    //     <path
    //       fill="#fcc085"
    //       d="M161.4,110.2c.2-9.4,7.9-17,17.4-17s17.2,7.6,17.4,17c-.2-8.1-7.9-14.7-17.4-14.7s-17.1,6.5-17.4,14.7Z"
    //     />
    //     <path
    //       fill="#b7e4f3"
    //       d="M187.7,102.1l-17.3,17.3c-2.2-2.1-3.6-5-3.8-8.2l12.9-12.9c3.2.2,6.1,1.6,8.2,3.8Z"
    //     />
    //     <path
    //       fill="#b7e4f3"
    //       d="M191.1,110.2l-12.6,12.6c-2.2,0-4.3-.7-6.1-1.8l16.9-16.9c1.1,1.8,1.7,3.8,1.8,6.1Z"
    //     />
    //     <path
    //       fill="#fcc085"
    //       d="M217.2,110.2c.2-9.4,7.9-17,17.4-17s17.2,7.6,17.4,17c-.2-8.1-7.9-14.7-17.4-14.7s-17.1,6.5-17.4,14.7Z"
    //     />
    //     <path
    //       fill="#b7e4f3"
    //       d="M243.5,102.1l-17.3,17.3c-2.2-2.1-3.6-5-3.8-8.2l12.9-12.9c3.2.2,6.1,1.6,8.2,3.8Z"
    //     />
    //     <path
    //       fill="#b7e4f3"
    //       d="M246.8,110.2l-12.6,12.6c-2.2,0-4.3-.7-6.1-1.8l16.9-16.9c1.1,1.8,1.7,3.8,1.8,6.1Z"
    //     />
    //     <path
    //       fill="#fcc085"
    //       d="M273,110.2c.2-9.4,7.9-17,17.4-17s17.2,7.6,17.4,17c-.2-8.1-7.9-14.7-17.4-14.7s-17.1,6.5-17.4,14.7Z"
    //     />
    //     <path
    //       fill="#b7e4f3"
    //       d="M299.2,102.1l-17.3,17.3c-2.2-2.1-3.6-5-3.8-8.2l12.9-12.9c3.2.2,6.1,1.6,8.2,3.8Z"
    //     />
    //     <path
    //       fill="#b7e4f3"
    //       d="M302.6,110.2l-12.6,12.6c-2.2,0-4.3-.7-6.1-1.8l16.9-16.9c1.1,1.8,1.7,3.8,1.8,6.1Z"
    //     />
    //     <path
    //       fill="#fcc085"
    //       d="M4.1,158l-.7-8.7,59.9-.3c19.2-.1,34.7-15.7,34.7-34.9l.7-2.7v5.4c0,19.1-15.5,34.6-34.6,34.6H7.6c-1.5,0-2.8,1.1-3,2.6l-.5,4Z"
    //     />
    //     <path
    //       fill="#fcc085"
    //       d="M117.7,63.8h-16c-1,.1-1.9.7-2.4,1.5l-.7,1.2v-5.9h19.1v3.1Z"
    //     />
    //     <path
    //       fill="#b6e4f5"
    //       d="M77.4,81.7c-21.8,10.8-40.1,27.5-52.7,48.2-.9,1.4-3,.5-2.7-1.1,5.7-26.2,27.5-46.4,54.5-49.8,1.6-.2,2.3,2,.8,2.8Z"
    //     />
    //     <polygon
    //       fill="#a4b6de"
    //       points="212 4.2 193.9 29.3 190.9 33.4 189.8 33.4 192.7 29.3 210.8 4.2 212 4.2"
    //     />
    //     <polygon
    //       fill="#a4b6de"
    //       points="172.7 33.4 154.6 58.5 151.7 58.5 169.8 33.4 172.7 33.4"
    //     />
    //     <polygon
    //       fill="#a4b6de"
    //       points="193.2 33.4 175.1 58.5 160.5 58.5 178.6 33.4 193.2 33.4"
    //     />
    //     <polygon
    //       fill="#a4b6de"
    //       points="228.3 4.2 210.2 29.3 198.5 29.3 216.6 4.2 228.3 4.2"
    //     />
    //     <path
    //       fill="#a4b6de"
    //       d="M396.4,81.4c-7.6-2.9-15.9-4.6-24.5-4.6s-2,0-3,0c-.2,0-.4,0-.6,0H119.7c0,0-1.4,0-1.4,0v-6.5h237.5c14.8,0,28.7,4,40.6,11Z"
    //     />
    //   </g>
    //   <g>
    //     <circle fill="#19294b" cx="36.5" cy="158.9" r="2.9" />
    //     <circle fill="#19294b" cx="70" cy="158.3" r="2.9" />
    //     <circle fill="#19294b" cx="98.3" cy="141.7" r="2.9" />
    //     <circle fill="#19294b" cx="108.1" cy="110.5" r="2.9" />
    //     <circle fill="#19294b" cx="108.1" cy="76.9" r="2.9" />
    //     <circle fill="#19294b" cx="143.5" cy="148.9" r="2.9" />
    //     <circle fill="#19294b" cx="143.5" cy="84.4" r="2.9" />
    //     <circle fill="#19294b" cx="143.5" cy="116.6" r="2.9" />
    //     <circle fill="#19294b" cx="143.5" cy="181.2" r="2.9" />
    //     <circle fill="#19294b" cx="143.5" cy="213.5" r="2.9" />
    //     <circle fill="#19294b" cx="334.1" cy="148.9" r="2.9" />
    //     <circle fill="#19294b" cx="334.1" cy="84.4" r="2.9" />
    //     <circle fill="#19294b" cx="334.1" cy="116.6" r="2.9" />
    //     <circle fill="#19294b" cx="334.1" cy="181.2" r="2.9" />
    //     <circle fill="#19294b" cx="334.1" cy="213.5" r="2.9" />
    //     <circle fill="#19294b" cx="178.8" cy="95.3" r=".9" />
    //     <circle fill="#19294b" cx="178.8" cy="125.8" r=".9" />
    //     <circle fill="#19294b" cx="189.6" cy="99.7" r=".9" />
    //     <circle fill="#19294b" cx="168" cy="121.4" r=".9" />
    //     <circle fill="#19294b" cx="194.1" cy="110.6" r=".9" />
    //     <circle fill="#19294b" cx="163.5" cy="110.6" r=".9" />
    //     <circle fill="#19294b" cx="189.6" cy="121.4" r=".9" />
    //     <circle fill="#19294b" cx="168" cy="99.7" r=".9" />
    //     <circle fill="#19294b" cx="234.6" cy="95.3" r=".9" />
    //     <circle fill="#19294b" cx="234.6" cy="125.8" r=".9" />
    //     <circle fill="#19294b" cx="245.4" cy="99.7" r=".9" />
    //     <circle fill="#19294b" cx="223.8" cy="121.4" r=".9" />
    //     <circle fill="#19294b" cx="249.9" cy="110.6" r=".9" />
    //     <circle fill="#19294b" cx="219.3" cy="110.6" r=".9" />
    //     <circle fill="#19294b" cx="245.4" cy="121.4" r=".9" />
    //     <circle fill="#19294b" cx="223.8" cy="99.7" r=".9" />
    //     <circle fill="#19294b" cx="290.3" cy="95.3" r=".9" />
    //     <circle fill="#19294b" cx="290.3" cy="125.8" r=".9" />
    //     <circle fill="#19294b" cx="301.2" cy="99.7" r=".9" />
    //     <circle fill="#19294b" cx="279.5" cy="121.4" r=".9" />
    //     <circle fill="#19294b" cx="305.6" cy="110.6" r=".9" />
    //     <circle fill="#19294b" cx="275.1" cy="110.6" r=".9" />
    //     <circle fill="#19294b" cx="301.2" cy="121.4" r=".9" />
    //     <circle fill="#19294b" cx="279.5" cy="99.7" r=".9" />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M443.4,150.7c0,48.4-39.2,87.6-87.6,87.6H92.9c-42.1,0-77.2-29.7-85.7-69.2h55.3c11.2,0,21.6-3.3,30.4-9,15.3-10,25.4-27.2,25.4-46.8v-49.6c0-.2,0-.4,0-.6h237.5c48.4,0,87.6,39.2,87.6,87.6Z"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M137.6,62.6l16.7-23.1c2.7-3.8,7.2-6.1,11.9-6.1h133.9c8.1,0,14.6,6.5,14.6,14.6v14.6h-177Z"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M297.6,18.8v14.6h-115.8l16.7-23.1c2.7-3.8,7.2-6.1,11.9-6.1h72.7c8.1,0,14.6,6.5,14.6,14.6Z"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M314.6,48h-70.6c-8.1,0-14.6-6.5-14.6-14.6h70.6c8.1,0,14.6,6.5,14.6,14.6Z"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M114.8,60.2c1.9,0,3.5,1.6,3.5,3.5v49.6c0,19.6-10.1,36.8-25.4,46.8-8.8,5.7-19.2,9-30.4,9H7.2c-1.7,0-3.2-1.2-3.5-2.9-.9-5-1.3-10.2-1.3-15.5s0,0,0,0c0-1.1.9-2,2-2h58.1c12.9,0,24.2-7,30.4-17.3,3.2-5.3,5-11.5,5-18.1v-49.6c0-1.9,1.6-3.5,3.5-3.5h13.4Z"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M8.3,148.7h54.3c12.9,0,24.2-7,30.4-17.3,3.2-5.3,5-11.5,5-18.1v-47.3s-5,0-5,0c-46.1,0-83.6,36.8-84.7,82.7h0Z"
    //     />
    //     <circle
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       cx="178.8"
    //       cy="110.6"
    //       r="18.3"
    //     />
    //     <circle
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       cx="178.8"
    //       cy="110.6"
    //       r="12.3"
    //     />
    //     <circle
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       cx="234.6"
    //       cy="110.6"
    //       r="18.3"
    //     />
    //     <circle
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       cx="234.6"
    //       cy="110.6"
    //       r="12.3"
    //     />
    //     <circle
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       cx="290.3"
    //       cy="110.6"
    //       r="18.3"
    //     />
    //     <circle
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       cx="290.3"
    //       cy="110.6"
    //       r="12.3"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M458.4,150.7c0,9.1-.9,18-2.5,26.6,0,0,0,.1,0,.2-1.7,8.2-8.9,14.2-17.3,14.2h-5.2c2.2-4.2,4.1-8.7,5.7-13.3,2.9-8.7,4.4-18,4.4-27.6s-1.6-18.9-4.4-27.6c-1.5-4.6-3.4-9-5.7-13.3h5.2c8.4,0,15.7,5.9,17.3,14.2,0,0,0,.1,0,.2,1.7,8.6,2.5,17.5,2.5,26.6Z"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M468.3,150.7c0,3.8-.2,7.6-.4,11.3-.6,7.3-5.5,13.3-12,15.5,0,0,0-.1,0-.2,1.7-8.6,2.5-17.5,2.5-26.6s-.9-18-2.5-26.6c0,0,0-.1,0-.2,6.6,2.2,11.5,8.2,12,15.5.3,3.7.4,7.5.4,11.3Z"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M478,143.4v14.6h-9.8c.1-2.4.2-4.9.2-7.3s0-4.9-.2-7.3h9.8Z"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M480.9,137.6h11.1c7.3,0,13.2,5.9,13.2,13.2h0c0,7.3-5.9,13.2-13.2,13.2h-11.1c-1.6,0-2.9-1.3-2.9-2.9v-20.5c0-1.6,1.3-2.9,2.9-2.9Z"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M509.6,93.7c0,14.1-6.2,33.7-10.7,45.9-2-1.3-4.4-2-6.9-2h-1.7c-3.5-11.8-8-29.2-8-41.4s7.3-17.5,12.7-17.5c11.1,0,14.6,9.8,14.6,15Z"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M482.3,96.1c0,12.2,4.5,29.6,8,41.4h-8.8c-3.5-11.8-8-29.2-8-41.4s7.3-17.5,12.7-17.5h8.8c-5.4,0-12.7,4.1-12.7,17.5Z"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M498.4,205.3c0,7.1-2.1,11.6-4.8,14.3-2.4,2.3-5.4,3.2-7.9,3.2h0c-11.1,0-14.6-9.8-14.6-15,0-13.3,5.6-31.7,10-43.9h9.3c3.5,11.8,8,29.2,8,41.4Z"
    //     />
    //     <path
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       stroke-width="2px"
    //       d="M507.1,205.3c0,13.4-7.3,17.5-12.7,17.5h-8.8c2.5,0,5.5-.9,7.9-3.2,2.7-2.6,4.8-7.1,4.8-14.3,0-12.2-4.5-29.6-8-41.4h1.7c2.4,0,4.6-.6,6.6-1.8,3.6,11.8,8.6,30.3,8.6,43.2Z"
    //     />
    //     <line
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       x1="137.6"
    //       y1="63.1"
    //       x2="137.6"
    //       y2="238.4"
    //     />
    //     <line
    //       fill="none"
    //       stroke="#19294b"
    //       stroke-miterlimit="10"
    //       x1="328.3"
    //       y1="63.8"
    //       x2="328.3"
    //       y2="238.4"
    //     />
    //   </g>
    // </svg>
  );
};
export const WordLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      className="fill-foreground"
      viewBox="0 0 2959.9 631.2"
    >
      <path d="M1128.8,178h-2.5c.4,0,.8,0,1.3,0s.8,0,1.3,0Z" />
      <path d="M1563.2,0h-257.7v632.2h98.3v-267h159.4c54.3,0,98.3-44,98.3-98.3V98.3c0-54.3-44-98.3-98.3-98.3ZM1563.2,245.1c0,12.1-9.8,21.9-21.9,21.9h-137.4V98.3h137.4c12.1,0,21.9,9.8,21.9,21.9v124.8Z" />
      <path d="M2435.8,178h-160.6s-98.3,0-98.3,0v454.3h98.3v-178h160.2c36-.3,67.4-20,84.3-49.1h0c.2-.4.5-.8.7-1.3,0,0,0,0,0-.1.5-.9,1-1.8,1.5-2.8.5-.9.9-1.9,1.4-2.8.2-.5.4-.9.7-1.4.2-.5.4-.9.6-1.4.2-.5.5-1.1.7-1.6.3-.7.6-1.4.9-2.2.2-.5.4-1.1.6-1.6.6-1.7,1.2-3.3,1.7-5,.2-.5.3-1,.5-1.5.2-.5.3-1,.4-1.5.3-1.1.6-2.3.9-3.4.3-1.5.7-2.9.9-4.4,0-.5.2-1,.3-1.5.1-.6.2-1.1.3-1.7,0-.5.2-1.1.2-1.6,0-.4.1-.8.2-1.3,0-.2,0-.4,0-.7,0,0,0-.2,0-.3,0-.4,0-.7.1-1.1.2-1.6.3-3.2.4-4.9,0-.2,0-.5,0-.7,0-.3,0-.7,0-1,0-.5,0-1.1,0-1.7s0-1.1,0-1.7v-79.7c0-53.9-43.3-97.6-97-98.3ZM2434.5,334.1c0,12.1-9.8,21.9-21.9,21.9h-137.4v-79.7h137.4c12.1,0,21.9,9.8,21.9,21.9v35.8Z" />
      <path d="M2435.4,454.3c-.3,0-.6,0-.9,0-.4,0-.8,0-1.3,0h2.1Z" />
      <path d="M2521.9,401c-.5.9-1,1.9-1.5,2.8.5-.9,1-1.8,1.5-2.8Z" />
      <path d="M2412.9,356c0,0-.2,0-.3,0h-137.4s137.7,0,137.7,0Z" />
      <polygon points="2961.3 178 2961.3 276.3 2832.5 276.3 2832.5 632.2 2734.2 632.2 2734.2 276.3 2611.4 276.3 2611.4 178 2961.3 178" />
      <path d="M790.2,178v356c0,54.3-44,98.3-98.3,98.3h-159.4c-54.3,0-98.3-44-98.3-98.3V178h98.3v334c0,12.1,9.8,21.9,21.9,21.9h115.5c12.1,0,21.9-9.8,21.9-21.9V178h98.3Z" />
      <path d="M1998.9,178h-159.4c-54.3,0-98.3,44-98.3,98.3v257.7c0,54.3,44,98.3,98.3,98.3h159.4c54.3,0,98.3-44,98.3-98.3v-257.7c0-54.3-44-98.3-98.3-98.3ZM1998.9,512c0,12.1-9.8,21.9-21.9,21.9h-115.5c-12.1,0-21.9-9.8-21.9-21.9v-213.8c0-12.1,9.8-21.9,21.9-21.9h115.5c12.1,0,21.9,9.8,21.9,21.9v213.8Z" />
      <path d="M256.3,178v-57.8c0-12.1-9.8-21.9-21.9-21.9h-115.5c-12.1,0-21.9,9.8-21.9,21.9v106.9c0,9.9,6.6,18.5,16.2,21.1l143.2,38.4,25.2,6.8c43.1,11.5,73.1,50.6,73.1,95.2v145.4c0,54.3-44,98.3-98.3,98.3H96.9c-54.3,0-98.3-44-98.3-98.3v-79.7h98.3v57.8c0,12.1,9.8,21.9,21.9,21.9h115.5c12.1,0,21.9-9.8,21.9-21.9v-106.9c0-9.9-6.6-18.5-16.2-21.1l-143.2-38.4-25.2-6.8C28.6,327.3-1.4,288.3-1.4,243.7V98.3C-1.4,44,42.6,0,96.9,0h159.4c54.3,0,98.3,44,98.3,98.3v79.7h-98.3Z" />
      <path d="M1225.9,276.3c0-27.1-11-51.7-28.8-69.5-17.8-17.8-42.4-28.8-69.5-28.8h-257.7v454.3h257.7c27.1,0,51.7-11,69.5-28.8,17.8-17.8,28.8-42.4,28.8-69.5v-79.7c0-17.9-4.8-34.7-13.2-49.1,8.4-14.5,13.2-31.2,13.2-49.2v-79.7ZM1127.6,512c0,12.1-9.8,21.9-21.9,21.9h-137.4v-79.7h137.4c12.1,0,21.9,9.8,21.9,21.9v35.8ZM1127.6,334c0,12.1-9.8,21.9-21.9,21.9h-137.4v-79.7h137.4c12.1,0,21.9,9.8,21.9,21.9v35.8Z" />
    </svg>
  );
};
