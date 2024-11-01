import { ContentContainer } from "components/common"
import { ScrollText, Tags } from "lucide-react";
import { ReactNode } from "react";

const TextSection = (props: { title: string, children: ReactNode | ReactNode[] }) => {
    return (
        <div className="mt-6">
            <h2 className="sticky top-12 bg-neutral-200 py-3 lg:text-5xl md:text-4xl text-3xl font-light tracking-wider text-neutral-500 lowercase">{props?.title}</h2>
            {props?.children}
        </div>
    )
}

const TextSectionParagraph = (props: { children: string }) => {
    return (
        <p className="mt-2 text-neutral-600">{props?.children}</p>
    )
}

const History = () => {
    return (
        <ContentContainer>
            <div>
                <div className="flex gap-2">
                    <Tags />
                    <h1 className="text-xl font-bold tracking-tighter text-neutral-800">ABOUT THE THEMES</h1>
                </div>
                <TextSection title="New Imperialism">
                    <TextSectionParagraph>
                        The period of New Imperialism (1875 to 1914) marked an era of unprecedented Euro-American colonial expansion into Asia, Africa, and Latin America. The modernization of technologies and weaponry largely enabled this widespread imperial takeover, along with the need for captive colonial markets for Euro-American industrializing economies. This era encouraged fierce competition among the British, French, Dutch and other “old” empires, while encouraging the entry of new global powers, such as the United States, Italy, Japan, Russia, and Germany. The era of New Imperialism coincided with the heyday of trade cards and postcards, which brought the Empire to common people in Western countries, enabling the consumption of accessible ephemera that depicted colonized landscape and peoples. Trade cards and postcards claimed to present colonized subjects with a realism undistorted by biases, especially using the new photographic and chromolithographic technologies. However, in reality, these objects enabled the “systemic distortion” of marginalized groups, and perpetuated racist and sexist stereotypes. Although understudied by historians, trade cards and postcards were important tools of imperial propaganda, and provide us valuable glimpses of social attitudes in the age of New Imperialism.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Jim Crow Laws">
                    <TextSectionParagraph>
                        After the American civil war and the abolition of slavery, a series of laws were passed enforcing and legitimizing racial segregation, discrimination, disenfranchisement, and anti-black racism in the United States. The period of Jim Crow laws in the late 19th and early 20th C was also the period when trade cards and postcards mass-circulated racist caricatures of African American people, such as the Mammy and Uncle Tom which have roots in American slavery and sustain the stereotypes of faithful servitude in post-emancipation America. They served as a sentimental souvenir of slavery and enabled white Americans to assuage their guilt and complicity in the history of slavery and the culture of racist discrimination. Trade cards and postcards enabled the mass distribution of themes, such as benevolent patriarchalism, white superiority, and scientific racism. Trade cards and postcards also enabled white Americans to symbolically buy, gift, and own black bodies in the form of collectible ephemera in the decades after abolition, and in an age when inter-racial social interaction was prohibited.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Yellow Peril and Asian Exclusion">
                    <TextSectionParagraph>
                        The late-nineteenth century witnessed tremendous anxiety about the supposed massive influx of East Asians (Yellow Peril) into Anglophone countries displacing white culture and stealing jobs. The Chinese Exclusion Act of 1882 suspended Chinese immigration to the United States for 10 years. This effort eventually expanded into the Asian Exclusion Act of 1924, which strictly limited Asian migration to the US. Asian menservants were still allowed entry to fill the domestic service sector, which faced a labor shortage, yet they became targets of xenophobia. The racist humor depicted in many of the trade cards and postcards exhibited here indicates how American people viewed Chinese men as perfect servants due to their perceived submissiveness and hard-working nature. Yet there was this paradoxical American eagerness to eradicate these “perpetual foreigners” from the country.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Women's Suffrage">
                    <TextSectionParagraph>
                        During the peak period of trade card and postcard circulation, white women in Britain and in North America were fighting for political rights. Their fight for the vote took them out of their households, leading to a perceived crisis of domestic labor, seen as the domain of women. While middle and upper-class Western women fought for political equality with men, working-class women in domestic servitude were marginalized from both the women’s movements and the trade union movement. In fact, domestic work was not even recognized as labor. Yet some maidservants were actively invested in both suffrage and labor rights activism in this period.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Servant Problem">
                    <TextSectionParagraph>
                        Due to the low-pay, long hours, and social stigma associated with domestic servitude, there was an acute shortage of working-class white women going into domestic service in the late 1800s and early 1900s. This led to a widespread perceived crisis of domestic labor, labeled by employers as the “servant problem”. The few who were still working in this field were seen as less desirable candidates. African American domestic workers, Chinese menservants and the Irish immigrant maidservant - who predominantly worked in the domestic service sector during the “Servant Problem” period - became the subject of sexist and racist humor in many of the trade cards and postcards.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Racialized Men-Servants">
                    <TextSectionParagraph>
                        Although domestic service underwent a feminization in the nineteenth century, non-white men-servants continued to provide domestic labor in British imperial households as well as American upper/middle-class households during the late 1800s and early 1900s. Although the British/American white man may not have been present in the imagery, white imperial masculinity is highlighted through the emasculation of black, brown and Asian men-servants.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="South Asian Men-Servants">
                    <TextSectionParagraph>
                        British imperial households in India employed a large retinue of Indian men-servants who worked specific caste-based roles such as cleaning, cooking, sweeping, serving etc. In Britain, middle-class households could not afford multiple servants, particularly menservants, due to the 1777 Servant Tax imposed on employers for menservants, making menservants very expensive. Postcards depicting Indian menservants could have been used to boast of the British imperial family’s affluence. Black and brown men-servants, moreover, had a long history of denoting status and imperial wealth in European family portraits. Postcards representing brown men-servants served as an ethnographic visual of what Indian people looked like. Additionally, the men-servants in the postcards were emasculated through their submissiveness and their depiction in feminine roles such as serving, cleaning and childcare.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Black Men-Servants/Uncle Tom stereotype">
                    <TextSectionParagraph>
                        Black men-servants, most commonly represented as the Tom stereotype, perpetuates the narrative of faithful, happy, and submissive servitude, who is reliable and ever-eager to serve. The Tom caricature was developed out of the Uncle Tom character in Harriet Beecher Stowe’s novel Uncle Tom’s Cabin, where he is a gentle Christian and a “faithful” domestic slave. Similar to the Mammy stereotype, Tom was used to support ideologies of slavery and servitude. This stereotype was explored in postcards as a way to promote the faithful black servant narrative and idolize Southern plantation culture in the post-emancipation period of Jim Crow racism.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Chinese Men-Servants/ 'Houseboy' and 'Laundryman' stereotype">
                    <TextSectionParagraph>
                        The Chinese “houseboy” served as the answer to the pesky “servant problem” of the late 1800s. Chinese immigrant men were believed to be wholly committed to a life of servitude, and were presumed to be willing to dismiss their own interests to prioritize their work and their employer, making them the “perfect servant”. However, the idea of a “foreign” male servant in white middle-class American and British imperial homes caused sexual anxieties and compromised the chastity of the house mistress. Sexual connotations and fears of “miscegenation” were removed through the degrading term “boy”, routinely used for adult non-white menservants. The attempt to emasculate Chinese men extended to the point where these men-servants were seen as a third gender or “eunuch”, outside the binary of male and female. Caricatures of Chinese “houseboys” and “laundry boys” abounded in trade cards and postcards, reflecting and perpetuating anxieties of Asian immigration to the United States. The desexualized infantilized Chinese “houseboy” stereotype also upheld the masculinity of white men in the British Empire.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Monkey Brand">
                    <TextSectionParagraph>
                        Black and Brown men-servants were animalized as a way to dehumanize and degrade them. This can be seen in the popular Monkey Brand Soap advertisements in Britain, where an anthropomorphic monkey was depicted performing domestic labor, understood as the domain of women. The use of a monkey caricature made invisible the domestic labor of working-class white maidservants or colonial men-servants. The human-monkey hybrid was meant to evoke racist humor in the wake of Darwinian evolutionary theory and simian qualities attributed to supposedly “less-evolved” African, Asian, and Irish people.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Racialized Maidservants">
                    <TextSectionParagraph>
                        Within the context of New Imperialism, gendered and racialized maidservants such as the South Asian ayah and Chinese amah of the British empire, the Indonesian baboe of the Dutch empire, and the Mexican criada of the Spanish empire, were sentimentalized and desexualized so that they could work in the private domestic spheres of white imperial homes. The baboe, ayah, amah, and criada held varying roles within the imperial home, from childcare to cleaning to general management, and were exoticized and sentimentalized in postcards.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="The Indian Ayah">
                    <TextSectionParagraph>
                        The ayah figure of South Asia was a crucial facet of British colonial presence in the subcontinent and served as a larger symbol for British respectability, interracial relations, and wealth. Ayahs were contracted Indian nursemaids who provided childcare and domestic labor services to British families, both in South Asia and during the long trans-oceanic voyages across the British Empire. The prominence of ayahs in the British colonial imagination coincided with the rise of fears regarding miscegenation. As hierarchies of race and scientific racism solidified, white Britons were anxious to maintain their racial purity in the empire. The ayah in particular was a target because of her intimate contact with the British family. Thus, the resulting caricature strove to desexualize her to the fullest extent possible: depicting the ayah as past her sexual prime, unattractive, and maternal. Pictorial representations of the ayah figure draped her in expensive, yet respectable clothing and jewelry to showcase the benevolence and wealth of her employers. She was deliberately exoticized, either through her stereotypical native attire or her tropical location, in order to fit the role of an Indian woman in the British imagination. This was achieved through staged “type” photographs to fulfill a particular white fantasy that was presented as real and anthropological.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Chinese Amah">
                    <TextSectionParagraph>
                        The amah figure, like the ayah, was another racialized Asian maidservant who was idolized in British imperial imagination. Amahs were commonly recruited from China’s Canton province and they sailed to Singapore and SE Asia to work as nursemaids, cooks, and housekeepers in the British Empire. They wore black and white uniforms and were referred to as “Black & White Amahs”.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Indonesian Baboe">
                    <TextSectionParagraph>
                        The baboe was the counterpart of the ayah in the Dutch Empire in Indonesia. Javanese and Balinese women were recruited as baboes to look after Dutch children in the SE Asian empire. Their colorful sarong and traditional slendang in which they carried children became the subjects of exoticization and Dutch Orientalist fascination.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Mexican Criada">
                    <TextSectionParagraph>
                        Native American domestic servants such as the Mexican criada were racialized in visual sources and ironically also exoticized as foreigners. Mexican domestics were initially young, unmarried women, but imperial domestic service later expanded to married women to augment the family income. Despite their frequent participation in movements to ensure their rights and protections, postcards depicted them as docile veiled figures.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="The Mammy">
                    <TextSectionParagraph>
                        The African American Mammy differs from other stereotypes of Black people (the Sambo, Tom, Sapphire, etc.) in its scope, sentiment, and reach throughout time. The Mammy is frequently portrayed as an older woman who works as a domestic servant for a middle or upper class white family. Her tasks throughout the house are generalized and all-encompassing, but the Mammy is mostly regarded as performing as a nanny or child-carer. This stereotype supposes the individual to be wholly desexualized (despite her accentuated bosom and hips), perpetually nurturing, and strict but loving. She is often depicted as being tall with broad shoulders, which is meant to be a means of masculinizing her; she is stereotyped as wearing a knotted, bright headdress - which is meant to be evocative of her heritage as an “exotic,” “otherized,” individual. Some traits seen in the Mammy figure are also found in other stereotypes of black people: the thick red lips, a simian appearance, and (sometimes, in the case of the Mammy) a knack for incivility. The Mammy is often illustrated as being nurturing and loving toward the white children she is employed to care for, and cruel and cold toward her own biological Black children. This facet of the stereotype is meant to suggest the inherent preferability of white people and the benevolence with which the white family claimed to civilize their black employees. This stereotype had its roots in American slavery during the antebellum period, but has remained as a common symbol throughout the world ever since. The Mammy figure peaked in popularity during the Jim Crow era, and served both as a sentimental souvenir of slavery and as a way of whitewashing the cruelty of slavery.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Working-class White Maidservants">
                    <TextSectionParagraph>
                        In the 19th century, both the United States and Britain experienced a feminization of the domestic industry due to factors such as the 1777 British tax on male servants, and the industrial employment opportunities for men. In the 19th century and early 20th century, a great number of these domestic workers were working-class white women, often separated from their employers not only by their socioeconomic status but through their national origins.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="The Irish 'Bridget'">
                    <TextSectionParagraph>
                        Ireland provided a significant number of domestic workers from the 1840s and onward in the U.S., becoming the single-largest group among servants in eastern metropolitan areas by 1850. These Irish immigrants often lacked formal training and hailed from rural, impoverished regions. The American and British public often referred to Irish immigrant domestics as “Bridgets,” alluding to an important Irish Catholic figure named Saint Brigid, which was also a popular name for girls in the mid-19th century. In this context, however, this name served as a shorthand used to homogenize the Irish population in British and American imagination. Urban middle-class white families frequently hired a live-in “Bridget” to signify their refinement, respectability, and social status. Common racialized tropes within the postcards in our collection depict “Bridgets” as lazy, ignorant, unaware of the parameters of their social status, and intoxicated. Conversely, they are also depicted as promiscuous, defiant, demanding, and devout Roman Catholics, all traits which threatened middle-class Protestant values. Belief in the promiscuity of “Bridgets” also positioned them in opposition with Victorian ideals of white womanhood that centralized sexual propriety and modesty, while helping distort the unfortuante reality of “Bridgets” suffering sexual predation from male employers. Other “Bridgets" were viewed as arrogant and too “difficult” to employ because they were known to negotiate work contracts or leave a job in search of better working conditions or higher wages. Some visual sources also degraded “Bridgets” further by giving them simian-like features similar to those used in depicting non-white colonial subjects, considered racial inferiors at the time. Although Irish immigrants were racialized as “not quite white,” their light complexion ultimately allowed subsequent generations of Irish workers to become integrated into the fold of whiteness. This privilege granted the Irish opportunities for class mobility, wealth-building, and gaining social respectability. For these reasons, issues of systemic oppression do not affect people of Irish descent today in the same way that they affect people of African descent, for example.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="French Eroticized Postcards">
                    <TextSectionParagraph>
                        The French postcards in our collection that depict racialized female domestics tend to transport a European consumer to a specific imagined site, specifically that of the “Oriental Harem.” In earlier times, harems were sectioned-off spaces within a Muslim household for wives, concubines, and female servants. Depicting such spaces gave consumers of the ephemera a voyeuristic delight in unveiling the mystery shrouding the intimate domestic lives of their non-white colonized subjects. The racialized female domestics, often shown with exposed breasts and carrying items like vases or coffee, are at once sexualized and not only bolster the popular conception of the “Orient” as a place of sexual laxity, but also suggest the serene refreshment that such domestics could provide to an employer or postcard recipient.
                    </TextSectionParagraph>
                </TextSection>
            </div>
            <div className="w-full h-[1px] my-12 bg-neutral-500"></div>
            <div className="pb-36">
                <div className="flex gap-2">
                    <ScrollText />
                    <h1 className="text-xl font-bold tracking-tighter text-neutral-800">CONCLUSION</h1>
                </div>
                <TextSection title="Erasure of Domestic workers' Voices">
                    <TextSectionParagraph>
                        Throughout their many stages of production and travel, our trade cards and postcards --and the stereotypes about domestic servants that they perpetuated--remained almost exclusively controlled by those from imperialist societies. As a consequence, the domestic servants who are routinely racialized, sexualized, infantilized, and otherwise degraded lacked the means necessary to produce their own postcards and trade cards to counter these narratives. By deconstructing these sources and problematizing them, we have tried to avoid perpetuating the harmful messages in their content, but our inability to recover sources that reveal the servants’ perspectives unfortunately reproduces the archival erasure of their agency and personhood. Just as employers and children in their charge often neglected to learn their names and used generic racialized terms such as “Ayah”, “Mammy”, “Baboe”, or “Boy”, there is much about the domestic servants in our collected ephemera that remains unknown. Often, the postcards and trade cards also leave tropical backgrounds ambiguous, constructing a monolithic “Oriental” landscape and deliberately ignoring the diversity of both the locations and peoples that colonial domestic industries affected. These cards also erased any exhaustion or pain involved in the actual labor and harsh conditions that domestic servants confronted, in effect delegitimizing any grievances that they often had about their terms of work. When advertising domestic commodities such as soap or wringers, trade cards further effaced contributions of domestic workers to the home as well as the grueling nature of their labor by implying that modern appliances facilitated their jobs and even eliminated the need for human domestic labor.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Hegemonic Construction of Whiteness">
                    <TextSectionParagraph>
                        Although the trade cards and postcards of racialized domestic workers tell us very little about the lived experiences of these marginalized people, they do tell us a lot about white middle/upper class people who employed them and collected these ephemera. They give us valuable glimpses into popular social and cultural attitudes in the age of New Imperialism and scientific racism. European colonizing forces self-constructed a hierarchy of race and attached it to their notions of purity and superiority. This fabricated ladder of blood purity was influenced by class and gender, which made these constructions of whiteness conveniently flexible based on what the location was and who the dominant class consisted of. Even within the commonly understood categories of race, such as ‘white,’ one’s social standing, occupation, family lineage, faith, and wealth made the degree of whiteness variable from person to person. Regardless of regional nuances, the basic implication of this Eurocentric rhetoric was that purity was held in the whitest of races, and the subsequent racialized categories were not only impure, but degenerations of the white race. It is through the bodies of domestic servants that these hierarchies of race and understandings of class and gender are projected. The intersectional identities of domestic servants, both within imperial environments and outside, became the faces of their racialized population through the proliferation of trade and postcards; the construction of these gendered and racialized domestic servants, to the white imagination, represented their entire ethnic or racial group. Trade cards and postcards were complicit in this racist history in that they provided visual fuel to socialize both the dominant and subaltern classes into embodying this ideology.
                    </TextSectionParagraph>
                </TextSection>
                <TextSection title="Lasting Impacts">
                    <TextSectionParagraph>
                        While the “servant problem” may be a thing of the past, paid care labor in the Global North is still largely provided by women of color, and immigrant women from the Global South, particularly in the wake of neoliberalization. In a continuity from cross-racial wetnursing, reproductive labor and even surrogacy is now outsourced by wealthy American and European couples to women in Asia and Africa. Stereotypes and racialized ideas of domestic labor did not die out either after the mid twentieth century. Popular media from this time seeps into the present in the form of children’s books and movies. And for the children who read these books, learning history fraught with caricatures of people of color perpetuates the teaching of systematic racism. Characters like the Ayah from Frances Hodgson Burnett’s The Secret Garden, Amelia Bedelia from the titular books, and various Black characters in the American Girl series passively diffuse ideas of racialized servitude, sexuality and imbecility of working-class women, immigrants and racialized groups. And as child consumers become adults, characters like Aunt Jemima, Flo from Progressive, and Manjula and Apu from The Simpsons still normalize racialized stereotypes. Mammy, Bridget and the Ayah may have left the world of trade cards and postcards, but they still shape the way people of color, immigrants, and domestic workers are perceived.
                    </TextSectionParagraph>
                </TextSection>
            </div>
        </ContentContainer>
    )
}

export default History;