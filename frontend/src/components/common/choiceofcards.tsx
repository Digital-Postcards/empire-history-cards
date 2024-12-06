import { ChoiceCard } from "components/cards";

const ChoiceOfCards = (props: { classes?: string }) => {
    return (
        <div className={`w-full grid lg:grid-cols-2 grid-cols-1 ` + props?.classes}>
            <ChoiceCard
                type="postcard"
                title="Postcards"
                image="/images/carousel/one.jpg"
                classes="border border-white border-0 border-b lg:border-r lg:border-b-0">
                <p>
                    Postcards, as we know them today, are small, rectangular cards with an image on one side and space
                    for a message and address on the verso, that serve as souvenirs from an event or location. Although
                    they occupy a more passive role in today&apos;s popular culture, picture postcards historically
                    served an imperial agenda, and were widely collected in the age of New Imperialism and Jim Crow. In
                    the early 1900s, known as the “golden age of postcards”, these images functioned as tools of empire,
                    constructing European and American understandings of non-white “others”. Prior to the integration of
                    postcards into popular media, wealthy patrons had been the sole commissioners and owners of detailed
                    paintings representing colonized or enslaved people, which they displayed in private households. The
                    low cost, reproducibility, and global circulation of postcards made them an accessible and
                    influential tool in constructing hegemonic whiteness and its understanding of racialized “others”.
                    Portable visual media was able to democratize the colonial gaze and encourage participation in
                    empire building, as the postcard tangibly represented the spoils of imperial expansion and
                    perpetuated stereotypes about marginalized people.
                </p>
            </ChoiceCard>
            <ChoiceCard type="tradecard" title="Tradecards" image="/images/wiki/one.jpg">
                <p>
                    Trade cards played a critical role in advertisements in the late 1800s, which was also the period of
                    rapid industrial expansion in North America and Europe. These small, portable, and collectible cards
                    displayed information about companies and their products in the context of booming industrial
                    production, while also circulating illustrations which contributed to notions of hegemonic whiteness
                    and the superiority of modern empires based on industrial capitalism. The passionate collection of
                    trade cards in the late 1800s also meant, indirectly, the passionate consumption of racialized and
                    gendered media. The roots of many modern-day racist, sexist, and classist stereotypes can be traced
                    through the proliferation of these cards. Although trade cards did not invent these racialized and
                    gendered figures, they broadened their reach to common people. Scientific racism was limited to
                    academic circles, but trade cards and later postcards, democratized race science, making it
                    accessible to working-class white people, through everyday commodities, a phenomenon historians have
                    called “commodity racism”.
                </p>
            </ChoiceCard>
        </div>
    );
};

export default ChoiceOfCards;
