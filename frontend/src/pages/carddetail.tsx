import { CardInfoBox } from "components/cards";
import { CardViewer } from "components/cards/cardviewer";
import InfoSection from "components/cards/infosection";
import { Loader } from "components/common";
import { useApi } from "hooks";
import SubLayoutWithGrid from "layouts/sublayoutwithgrid";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { SingleCard } from "types";

const CardDetail = () => {
    const { cardId } = useParams();
    const { data, error, fetchData, isLoading } = useApi("/cards/" + cardId, { method: "GET" });

    const getData = async () => {
        await fetchData();
    };

    useEffect(() => {
        getData();
    }, []);

    if (isLoading) return <Loader isFullSize={true} />;

    if (!data) return <p>No such card exists</p>;

    if (error) return <p>Error fetching card data</p>;

    return (
        <SubLayoutWithGrid>
            <div className="md:col-span-6 col-span-8 p-6 h-fit pb-12 md:order-1 order-2">
                <CardViewer images={(data as SingleCard).imageLinks} isBlur={(data as SingleCard).isBlurByDefault} />
                {(data as SingleCard)?.description && (
                    <InfoSection label="Description">
                        <p className="text-justify">{(data as any)?.description}</p>
                    </InfoSection>
                )}
                {(data as SingleCard)?.analysis && (
                    <InfoSection label="Analysis">
                        <p className="text-justify">{(data as any)?.analysis}</p>
                    </InfoSection>
                )}
                {(data as SingleCard)?.message && (
                    <InfoSection label="Message">
                        <p>{(data as any)?.message}</p>
                    </InfoSection>
                )}
            </div>
            <div className="md:col-span-2 col-span-8 md:py-6 pt-6 md:px-0 px-6 md:pr-4 md:order-2 order-1">
                <CardInfoBox
                    tags={(data as SingleCard).themes}
                    date={(data as SingleCard).date}
                    location={(data as SingleCard).place}
                    country={(data as SingleCard).country}
                    postmarked={(data as SingleCard).postmarked}
                    company={(data as SingleCard).company}
                    companyInformation={(data as SingleCard).companyInformation}
                    number={(data as SingleCard).number}
                    item={(data as SingleCard).item}
                />
            </div>
        </SubLayoutWithGrid>
    );
};

export default CardDetail;
