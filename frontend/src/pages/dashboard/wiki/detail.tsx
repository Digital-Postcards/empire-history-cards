import { CardInfoBox } from "components/dashboard/wiki";
import { CardViewer } from "components/dashboard/wiki/cardviewer";
import InfoSection from "components/dashboard/wiki/infosection";

const WikiDetail = () => {
    return (
        <>
            <div className="md:col-span-6 col-span-8 p-6 h-fit pb-12 md:order-1 order-2">
                <CardViewer />
                <InfoSection label="History">
                    <p>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Mauris dis tempus donec, nascetur nisl risus ante. Mus diam sodales luctus; per vehicula eu turpis est. Auctor lacinia ridiculus cursus hac nostra laoreet augue et. Convallis dis tortor fames convallis rhoncus iaculis aliquam ante. Venenatis nascetur dis eros convallis fringilla vehicula hac aliquet. Mattis sapien habitasse tincidunt curabitur efficitur praesent metus. Litora tristique ullamcorper at tempus pretium; semper facilisi dignissim.

                    Fusce fringilla habitant vivamus tempus metus congue erat curae proin. Ex aenean sodales efficitur taciti nisl condimentum elementum quam eleifend. Lobortis taciti posuere fusce gravida parturient curae pulvinar risus! Posuere amet lacinia penatibus cras, sollicitudin sapien dapibus. Mauris per sagittis cubilia feugiat leo adipiscing molestie praesent aliquam. Finibus leo aenean turpis natoque posuere lacinia. Tellus per fames litora magnis fringilla lobortis. Quam efficitur dolor ornare ante dictumst nec libero. Porttitor dignissim venenatis; placerat justo fusce neque per.
                    </p>
                </InfoSection>
                <InfoSection label="Analysis">
                    <p>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Mauris dis tempus donec, nascetur nisl risus ante. Mus diam sodales luctus; per vehicula eu turpis est. Auctor lacinia ridiculus cursus hac nostra laoreet augue et. Convallis dis tortor fames convallis rhoncus iaculis aliquam ante. Venenatis nascetur dis eros convallis fringilla vehicula hac aliquet. Mattis sapien habitasse tincidunt curabitur efficitur praesent metus. Litora tristique ullamcorper at tempus pretium; semper facilisi dignissim.

                    Fusce fringilla habitant vivamus tempus metus congue erat curae proin. Ex aenean sodales efficitur taciti nisl condimentum elementum quam eleifend. Lobortis taciti posuere fusce gravida parturient curae pulvinar risus! Posuere amet lacinia penatibus cras, sollicitudin sapien dapibus. Mauris per sagittis cubilia feugiat leo adipiscing molestie praesent aliquam. Finibus leo aenean turpis natoque posuere lacinia. Tellus per fames litora magnis fringilla lobortis. Quam efficitur dolor ornare ante dictumst nec libero. Porttitor dignissim venenatis; placerat justo fusce neque per.
                    </p>
                </InfoSection>
                <InfoSection label="Message">
                    <p>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Mauris dis tempus donec, nascetur nisl risus ante. Mus diam sodales luctus; per vehicula eu turpis est. Auctor lacinia ridiculus cursus hac nostra laoreet augue et. Convallis dis tortor fames convallis rhoncus iaculis aliquam ante. Venenatis nascetur dis eros convallis fringilla vehicula hac aliquet. Mattis sapien habitasse tincidunt curabitur efficitur praesent metus. Litora tristique ullamcorper at tempus pretium; semper facilisi dignissim.

                    Fusce fringilla habitant vivamus tempus metus congue erat curae proin. Ex aenean sodales efficitur taciti nisl condimentum elementum quam eleifend. Lobortis taciti posuere fusce gravida parturient curae pulvinar risus! Posuere amet lacinia penatibus cras, sollicitudin sapien dapibus. Mauris per sagittis cubilia feugiat leo adipiscing molestie praesent aliquam. Finibus leo aenean turpis natoque posuere lacinia. Tellus per fames litora magnis fringilla lobortis. Quam efficitur dolor ornare ante dictumst nec libero. Porttitor dignissim venenatis; placerat justo fusce neque per.
                    </p>
                </InfoSection>
            </div>
            <div className="md:col-span-2 col-span-8 md:py-6 pt-6 md:px-0 px-6 md:pr-4 md:order-2 order-1">
                <CardInfoBox />
            </div>
        </>
    )
}

export default WikiDetail;