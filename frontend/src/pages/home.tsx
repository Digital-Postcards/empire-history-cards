import { ChoiceOfCards, ContentContainer } from "components/common";

const HomePage = () => {
    return (
        <ContentContainer>
            <p className="text-lg text-justify">
                Our exhibition explores the proliferation of racism and sexism in the age of New Imperialism, Jim Crow
                segregation, and Asian Exclusion through a study of popular visual depictions of domestic workers in the
                medium of trade cards (late 1800s) and postcards (early 1900s). In investigating derogatory depictions
                of servants across global empires, our aim is to deconstruct through a critical lens how stereotypes and
                racialization of working-class/ colonized people constructed a dangerous narrative of hegemony that
                allowed certain—white, imperial, upper/middle class—populations to dominate social, cultural, economic,
                and political spaces across the world. The exhibition is organized thematically, following marginalized
                domestic workers across the globe, with an intent to uncover how the perpetuation of imperialist
                ideologies mimicked the transnational movement of postcards and trade cards themselves. By centering
                degrading historical objects, we hope to inspire critical conversations about anti-racism and social
                justice. As you explore this visual culture exhibit, we request that you keep the following question in
                mind: how can contextualizing racist and sexist historical images help us to identify and dismantle
                contemporary systemic biases?
            </p>
            <ChoiceOfCards classes="mt-12 mb-24" />
        </ContentContainer>
    );
};

export default HomePage;
