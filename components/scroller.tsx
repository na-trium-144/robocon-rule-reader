import { useEffect } from "react";
import * as Scroll from "react-scroll";

export default function AutoScroller(props: { id: string | null }) {
  useEffect(() => {
    if (props.id) {
      setTimeout(() => {
        try {
          Scroll.scroller.scrollTo(props.id as string, {
            duration: 300,
            smooth: true,
            offset: -200,
          });
        } catch {
          console.error(`Failed to scroll to ${props.id as string}`);
        }
      }, 10);
    }
  }, [props.id]);
  return <></>;
}
