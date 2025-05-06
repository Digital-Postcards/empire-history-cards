import { NavLinkType } from "types";
const REACT_APP_SERVER_URL =
    process.env.REACT_APP_SERVER_URL || "https://visualdomesticlaborhistory.khoury.northeastern.edu";
const API_URL = REACT_APP_SERVER_URL + "/api";

const MAIN_NAV_LINKS: NavLinkType[] = [
    {
        label: "Introduction",
        path: "/",
    },
    {
        label: "History",
        path: "/history",
    },
    {
        label: "Ethics of Representation",
        path: "/ethics-of-representation",
    },
    {
        label: "Scrapbook",
        path: "/flipbook",
    },
    {
        label: "Map",
        path: "/map",
    },
    {
        label: "Themes",
        path: "/themes",
    },
    {
        label: "Cards",
        path: "/cards",
    },
    {
        label: "Bibliography",
        path: "/bibliography",
    },
    {
        label: "About",
        path: "/about",
    },
];

const MAX_ZOOM_FOR_MAP: number = 8;

const BIBLIOGRAPHY_CONTENT = {
    sections: [
        {
            title: "Resources on Postcards",
            resources: [
                "Alloula, Malek. The Colonial Harem. Minneapolis: University of Minnesota Press, 1986.",
                'Chakraborty, Satyasikha: "Mammies, Ayahs, Baboes: Postcards of Racialized Nursemaids from the Early Twentieth Century", Visual Culture and Gender, Vol. 13, 17-31, 2018.',
                "Khan, Omar. Paper Jewels: Postcards from the Raj. New Delhi: Mapin Publishing, 2018.",
                "Prochaska, David, and Mendelson, Jordana: Postcards: Ephemeral Histories of Modernity. Penn State University Press, 2010.",
                "Pyne, Lydia. Postcards: The Rise and Fall of the World's First Social Network. Reaktion Books, 2021.",
            ],
        },
        {
            title: "Resources on Trade cards and racialized advertisements",
            resources: [
                'Schultz, April. "The Black Mammy and the Irish Bridget: Domestic Service and the Representation of Race, 1830–1930." Éire-Ireland 48, no. 3 & 4 (Fall/Winter 2013): 176–212.',
                "Jay, Robert. The Tradecard in Nineteenth-Century America. Columbia: University of Missouri Press, 1987.",
                'McClintock, Anne. "Soft-Soaping Empire: Commodity Racism and Imperial Advertising." In Imperial Leather: Race, Gender, and Sexuality in the Colonial Contest, 207–231. New York: Routledge, 1995.',
                'Mehaffy, Marilyn Maness. "Advertising Race/Raceing Advertising: The Feminine Consumer(-Nation), 1876–1900." Signs 23, no. 1 (Autumn 1997): 131–174.',
                "Ramamurthy, Anandi. Imperial Persuaders: Images of Africa and Asia in British Advertising. Manchester: Manchester University Press, 2003.",
            ],
        },
        {
            title: "Resources on the history of domestic labor",
            resources: [
                "Chakraborty, Satya Shikha, Colonial Caregivers: Ayahs and the Gendered History of Race and Caste in British India. London: Cambridge University Press, 2025.",
                "Hicks, Anasa. Hierarchies at Home: Domestic Service in Cuba from Abolition to Revolution. New York: Cambridge University Press, 2022.",
                "Lowrie, Claire. Masters and Servants: Cultures of Empire in the Tropics. Manchester: Manchester University Press, 2016.",
                "Martínez, Julia, Claire Lowrie, Frances Steel, and Victoria Haskins. Colonialism and Male Domestic Service across the Asia Pacific. London: Bloomsbury Academic, 2020.",
                "Miller, Margaret Lynch. The Irish Bridget: Irish Immigrant Women in Domestic Service in America, 1840–1930. Syracuse, NY: Syracuse University Press, 2009.",
                "Pilgrim, David. Understanding Jim Crow: Using Racist Memorabilia to Teach Tolerance and Promote Social Justice. Oakland: PM Press, 2015.",
                "Schwartz, Laura. Feminism and the Servant Problem: Class and Domestic Labour in the Women's Suffrage Movement. Cambridge: Cambridge University Press, 2019.",
                "Urban, Andrew. Brokering Servitude: Migration and the Politics of Domestic Labor during the Long Nineteenth Century. New York: New York University Press, 2018.",
                "Wallace-Sanders, Kimberly. Mammy: A Century of Race, Gender, and Southern Memory. Ann Arbor: University of Michigan Press, 2008.",
            ],
        },
        {
            title: "Websites",
            resources: [
                "https://ayahsandamahs.com/",
                "https://www.dwherstories.com/",
                "https://jimcrowmuseum.ferris.edu/",
            ],
        },
    ],
};

const ABOUT_PAGE_CONTENT = {
    paragraph1: `The <em>Visual Culture of Domestic Labor</em> Digital Humanities project evolved from the personal collection of historical trade cards and postcards of <a href="https://history.tcnj.edu/satya-shikha-chakraborty/" target="_blank">Satya Shikha Chakraborty, Assistant Professor of History,
                at The College of New Jersey</a>. She started collecting back in 2013, while researching the colonial history of Indian ayahs for her PhD. In 2020, while sharing her collection with Joydeep Mitra, who at the time
                was a Research Assistant Professor of Computer Science at Stony Brook University, the idea of a collaborative digital history project was born, that would deploy the historical analysis skills of TCNJ History 
                students, and the technological/ coding skills of Stony Brook Computer Science students.`,
    paragraph2: `In 2024, the DH project moved with <a href="https://www.khoury.northeastern.edu/people/joydeep-mitra/" target="_blank">Dr. Mitra to Northeastern University</a>. This new version uses feedback we received from 
                the <a href="https://library.brown.edu/neh-institute-born-digital-scholarly-publishing/" target="_blank">2024 NEH Institute on Digital Humanities at Brown University</a>. The project has also been supported by mini-grants from the HSS Dean's Office and Center for Excellence in Teaching and Learning (CETL) at The College of New Jersey. `,
    paragraph3: `The History/Art History students worked on analyzing the trade cards and postcards, and writing transcripts for the digital exhibition, as part of a group research seminar <em>Race, Gender, and the Visual
                Culture of Domestic Labor: Trade Cards and Postcards from the age of New Imperialism, Jim Crow Racism, and Asian Exclusion</em>, taught by Prof. Chakraborty in Spring 2022.`,
    paragraph4: `The DH project has been a collaborative effort driven by talented Computer Science students from two institutions. The <span><a href="https://empirehistorycards.cs.stonybrook.edu/" target="_blank">first version</a></span> of the project was designed and developed by students at Stony Brook University, showcasing their innovative spirit and technical expertise.
                <br><br>Building on this foundation, Akshay Chavan, Zitong Bao, and Parthiv Menon — Computer Science students at Northeastern University's Khoury College of Computer Sciences — enhanced the application by integrating advanced visualization features that significantly improved both functionality and user experience. Akshay further developed a dedicated admin portal for the application, enabling streamlined data management, user access control, and easier deployment of updates. The project further benefited from the robust digital infrastructure and support provided by Khoury College, which played a key role in hosting and maintaining the application's accessibility.
                <br><br>Both iterations of the project were guided by Prof. Joydeep Mitra, whose mentorship helped bring this project to life.
                `,
    csTeam: [
        {
            imageURL: "/images/about/profmitra.png",
            name: "Prof. Joydeep Mitra",
            role: "Assistant Professor",
            links: {
                website: "https://joymitra.github.io/",
                linkedin: "https://www.linkedin.com/in/joydeepmitraksu/",
                google_scholar: "https://scholar.google.com/citations?user=9YST-BcAAAAJ&hl=en",
                email: "j.mitra@northeastern.edu",
            },
        },
        {
            imageURL: "/images/about/akshay.jpg",
            name: "Akshay Chavan",
            role: "MSCS Student",
            // aspectRatio: "900 / 746",
            links: {
                website: "https://akshaychavan7.github.io/",
                linkedin: "https://www.linkedin.com/in/akshaychavan7/",
                google_scholar: "https://scholar.google.com/citations?hl=en&user=HI8ImL0AAAAJ",
                email: "akshaychavan.kkwedu@gmail.com",
            },
        },
        {
            imageURL: "/images/about/parthiv.png",
            name: "Parthiv Menon",
            role: "MSCS Student",
            links: {
                website: "https://parthivmenon.com/",
                linkedin: "https://linkedin.com/in/parthivmenon",
                google_scholar: "https://scholar.google.com/citations?user=04re_2oAAAAJ&hl=en&oi=ao",
                email: "parthivmenon01@gmail.com",
            },
        },
        {
            imageURL: "/images/about/zitong.png",
            name: "Zitong Bao",
            role: "MSCS Student",
            links: {
                // website: "",
                linkedin: "https://linkedin.com/in/zitong-bao-23115b274",
                email: "bao.zit@northeastern.edu",
                // google_scholar: "",
            },
        },
    ],
};

const HISTORY_PAGE_CONTENT = {
    about_themes: [
        {
            tag: "New Imperialism",
            title: "New Imperialism",
            content: `The “golden age” of trade cards and postcards (1870s to 1940s) coincided with the period of New Imperialism, which marked an era of unprecedented Euro-American colonial expansion into Asia, Africa, and Latin America. The modernization of technologies and weaponry largely enabled this widespread imperial takeover, along with the need for captive colonial markets for Euro-American industrializing economies. This era encouraged fierce competition among the British, French, Dutch and other “old” empires, while encouraging the entry of new global powers, such as the United States, Italy, Japan, Russia, and Germany. The era of New Imperialism was the heyday of trade cards and postcards, which brought the Empire to common people in Western countries, enabling the consumption of accessible ephemera that depicted colonized landscape and peoples. Trade cards and postcards claimed to present colonized subjects with a realism undistorted by biases, especially using the new photographic and chromolithographic technologies. However, in reality, these objects enabled the “systemic distortion” of marginalized groups, and perpetuated racist and sexist stereotypes. Although understudied by historians, trade cards and postcards were important tools of imperial propaganda, and provide us valuable glimpses of social attitudes in the age of New Imperialism. A lot of the trade cards and postcards depict black, brown, and indigenous people in servile and laboring roles, naturalizing their subordinate position to white people.`,
            image: "/images/history/New Imperialism.jpg",
        },
        {
            tag: "Jim Crow",
            title: "Jim Crow Laws and Anti-Black Racism",
            content: `After the American civil war and the abolition of slavery, a series of laws were passed enforcing and legitimizing racial segregation, discrimination, disenfranchisement, and anti-black racism in the United States. The period of Jim Crow laws in the late 19th and early 20th C was also the period when trade cards and postcards mass-circulated racist caricatures of African American people, such as the Mammy and Uncle Tom which have roots in American slavery and sustain the stereotypes of faithful servitude in post-emancipation America. They served as a sentimental souvenir of slavery and enabled white Americans to assuage their guilt and complicity in the history of slavery and the culture of racist discrimination. Trade cards and postcards enabled the mass distribution of themes, such as benevolent paternalism, white superiority, and scientific racism. Trade cards and postcards also enabled white Americans to symbolically buy, gift, and own black bodies in the form of collectible ephemera in the decades after abolition, and in an age when inter-racial social interaction was prohibited.`,
            image: "/images/history/30A.jpg",
        },
        {
            tag: "Asian Exclusion",
            title: "Yellow Peril and Asian Exclusion",
            content: `The late-nineteenth century witnessed tremendous anxiety about the supposed massive influx of East Asians into Anglophone countries displacing white culture and stealing white jobs. This “Yellow Peril” led to the Chinese Exclusion Act of 1882, which suspended Chinese immigration to the United States. This effort eventually expanded into the Asian Exclusion Act of 1924, which strictly limited Asian migration to the US. Asian menservants and laundrymen were still allowed entry to fill the domestic service sector, which faced a labor shortage, yet they became targets of xenophobia. The racist humor depicted in many of the trade cards and postcards exhibited here indicates how American (and also British) people viewed Chinese men as perfect servants due to their perceived submissiveness and hard-working nature. Yet there was this paradoxical American eagerness to eradicate these “unassimilable” “perpetual foreigners” from the country.`,
            image: "/images/history/Yellow Peril and Asian Exclusion.jpg",
        },
        {
            title: "Women's Suffrage",
            content: `During the peak period of trade card and postcard circulation, white women in Europe and in North America were fighting for political rights. Their fight for the vote took them out of their households, leading to a perceived crisis of domestic labor, seen as the domain of women. Anti-suffragists capitalized on the patriarchal anxieties around domestic labor, producing numerous postcards depicting husbands consigned to childcare and domestic chores, because their wives were now taking part in politics. These postcards portrayed a comic dystopia of role-reversal if women got the right to vote. In the process, domestic labor and care labor were further devalued. However, in reality, this fear was largely unfounded, as domestic labor continued to be performed by women – both unpaid housewives and paid maidservants during and after the suffrage movement. While middle and upper-class Western women fought for political equality with men, working-class women in domestic servitude were marginalized from both the women’s movement and the labor movement, as domestic labor was not seen as labor.`,
            image: "/images/history/Women's Suffrage.jpeg",
        },
        {
            title: "Servant Problem",
            content: `Due to the low-pay, long hours, and social stigma associated with domestic servitude, there was an acute shortage of working-class white women going into domestic service in the late 1800s and early 1900s. This led to a widespread perceived crisis of domestic labor, labeled by employers as the “servant problem”. The few who were still working in this field were seen as less desirable candidates. African American domestic workers, Chinese menservants and the Irish immigrant maidservant - who predominantly worked in the domestic service sector during the “Servant Problem” period - became the subject of sexist and racist humor in many of the trade cards and postcards. White maids were viewed as arrogant and too difficult to employ because they were known to negotiate work contracts or leave a job in search of better working conditions or higher wages.`,
            image: "/images/history/309A.jpg",
        },
        {
            title: "Racialized Maidservants",
            content: `Within the context of New Imperialism, gendered and racialized maidservants such as the South Asian ayah and Chinese amah of the British empire, the Indonesian baboe of the Dutch empire, and the Mexican criada of the Spanish empire, were sentimentalized and desexualized so that they could work in the private domestic spheres of white imperial homes. The baboe, ayah, amah, and criada held varying roles within the imperial home, from childcare to cleaning to general management, and were exoticized and sentimentalized in trade cards and postcards.`,
            image: "",
        },
        {
            title: "African American Mammy",
            content: `The Mammy stereotype had its roots in American slavery during the antebellum period, but peaked in popularity during the Jim Crow era, and served both as a sentimental souvenir of slavery and as a way of whitewashing the cruelty of slavery. Trade cards and postcards depicting the black Mammy flourished in the United States in the late-1800s and early-1900s. The Mammy was usually desexualized (despite her accentuated bosom and hips) and depicted as a strict but loving black maidservant and nanny, who was portrayed as particularly attached to white children, often more than her own children. This erased the sad realities of many black women, who were separated from their own children during the era or slavery and even afterwards, as they took care of white children and toiled in white homes. Many of the trade cards and postcards, particularly the linen postcards depicting the Mammy figure, are degradingly racist, more so than the depictions of colonized maidservants in European colonial empires.`,
            image: "/images/history/Mammy.jpg",
        },
        {
            title: "Indian Ayah",
            content: `The ayah figure of South Asia was a crucial facet of British colonial presence in the subcontinent and served as a larger symbol for British respectability and interracial harmony. Ayahs were contracted Indian nursemaids who provided childcare and domestic labor services to British families, both in South Asia and during the long trans-oceanic voyages across the British Empire. The ayah figure was desexualized and maternalized. Pictorial representations of the ayah figure draped her in expensive, yet respectable clothing and jewelry to showcase the benevolence and wealth of her employers. She was deliberately exoticized, either through her stereotypical native attire or her tropical location, in order to fit the role of an Indian woman in the British imagination. This was often achieved through staged “type” photographs to fulfill a particular white fantasy that was presented as real and anthropological.`,
            image: "/images/history/ayah.jpg",
        },
        {
            title: "Chinese Amah",
            content: `The amah figure, like the ayah, was another racialized Asian maidservant who was idolized in British imperial imagination. Amahs were commonly recruited from China’s Canton province and they sailed to Singapore and SE Asia to work as nursemaids, cooks, and housekeepers in the British Empire. They wore black and white uniforms and were referred to as “Black & White Amahs”. Not too many postcards are available depicting the Chinese amah, probably because their peak employment decades were slightly after the “golden age” of postcards.`,
            image: "/images/history/Chinese Amah.jpg",
        },
        {
            title: "Indonesian Baboe",
            content: `The baboe was the counterpart of the ayah in the Dutch Empire in Indonesia. Javanese and Balinese women were recruited as baboes to look after Dutch children in the SE Asian empire. Their colorful sarong and traditional slendang in which they carried children became the subjects of exoticization and Dutch Orientalist fascination. Postcards depicting the baboe are much rarer than those depicting the ayah or mammy.`,
            image: "/images/history/Baboe.jpg",
        },
        {
            title: "Mexican Criada",
            content: `Indigenous domestic servants such as the Mexican criada were racialized in visual sources and ironically also exoticized as foreigners. Mexican domestics were initially young, unmarried women, but imperial domestic service later expanded to married women to augment the family income. Despite their frequent participation in movements to ensure their rights and protections, postcards depicted them as docile veiled and exotic figures.`,
            image: "/images/history/Mexican Criada.jpg",
        },
        {
            title: "Irish 'Bridget'",
            content: `Ireland provided a significant number of domestic workers in Britain and well as in the U.S. from the mid-1800s, particularly after the Irish Famine. Irish immigrants often lacked formal training and hailed from rural, impoverished regions. The American and British public often referred to Irish immigrant domestics as “Bridgets,” alluding to the Catholic Saint Brigid, also a popular name for Irish girls. Common racialized tropes within the postcards in our collection depict “Bridgets” as lazy, ignorant, unaware of the parameters of their social status, and intoxicated. Conversely, they are also depicted as promiscuous, defiant, demanding, and devout Roman Catholics, all traits which threatened middle-class Protestant values. Some visual sources also degraded “Bridgets” further by giving them simian-like features similar to those used in depicting non-white colonial subjects, considered racial inferiors at the time. Although Irish immigrants were racialized as “not quite white,” their light complexion ultimately allowed subsequent generations of Irish workers to become integrated into the fold of whiteness. This privilege granted Irish maidservants opportunities for class mobility, wealth-building, and gaining social respectability, in ways that were not available to maidservants of African descent, for example.`,
            image: "/images/history/Irish Bridget.jpg",
        },
        {
            title: "Working-class White Maidservants",
            content: `Many of the postcards in our collection are of white maidservants in European and North American homes. In the 19th century, both the United States and Britain experienced a feminization of the domestic service industry with growing industrial employment opportunities for men, and the cult of domesticity for women. In the 19th century and early 20th century, many maidservants were working-class and immigrant white women, separated from their employers not only by their socioeconomic status but sometimes also through their national origins. Many of the postcards in our collection depict young white maidservants in sexually compromised situations, either with their middle-class master, or with their working-class suitors, particularly policemen – the “Bobby” or “Copper”. Belief in the promiscuity of working-class and immigrant maidservants positioned them in opposition with ideals of middle-class white womanhood that centralized sexual propriety and modesty, while helping distort the unfortunate reality of young maidservants; suffering sexual predation from male employers and then blamed and laid off by their mistresses.`,
            image: "/images/history/White maidservant.jpg",
        },
        {
            title: "Racialized Men-Servants",
            content: `Although domestic service underwent a feminization in the nineteenth century, non-white men-servants continued to provide domestic labor in European imperial households as well as American upper/middle-class households during the late 1800s and early 1900s. Although the European/American white man may not have been always present in the imagery, white imperial masculinity is highlighted through the emasculation of black, brown and Asian men-servants in these trade cards and postcards.`,
            image: "",
        },
        {
            title: "Indian Men-Servants",
            content: `British imperial households in India employed a large retinue of Indian men-servants who worked specific caste-based roles such as cleaning, cooking, sweeping, serving etc. In Britain, middle-class households could not afford multiple servants, particularly menservants, due to the 1777 Servant Tax imposed on employers for menservants, making menservants very expensive. Postcards depicting Indian menservants could have been used to boast of the British imperial family’s affluence. Black and brown men-servants, moreover, had a long history of denoting status and imperial wealth in European family portraits. Postcards representing brown men-servants served as an ethnographic visual of what Indian people looked like. Additionally, the men-servants in the postcards were emasculated through their submissiveness and their depiction in domestic roles such as serving, cleaning and childcare, which were feminized in Britain.`,
            image: "/images/history/Indian menservants.jpg",
        },
        {
            title: "Black Men-Servants",
            content: `Black men-servants, most commonly represented as the Tom stereotype, perpetuates the narrative of faithful, happy, and submissive servitude, who is reliable and ever-eager to serve. The Tom caricature was developed out of the Uncle Tom character in Harriet Beecher Stowe’s novel Uncle Tom’s Cabin, where he is a gentle Christian and a “faithful” domestic slave. Similar to the Mammy stereotype, Tom was used to support ideologies of slavery and servitude. This stereotype was explored in postcards as a way to promote the faithful black servant narrative and idolize Southern plantation culture in the post-emancipation period of Jim Crow racism. Some of the black menservant figures examined in our project also depict African and Caribbean menservants in European colonial empires.`,
            image: "/images/history/Black menservants.jpg",
        },
        {
            title: "Chinese Men-Servants",
            content: `The Chinese “houseboy” served as the answer to the pesky “servant problem” of the late 1800s. Chinese immigrant men were believed to be wholly committed to a life of servitude, and were presumed to be willing to dismiss their own interests to prioritize their work and their employer, making them the “perfect servant”. However, the idea of a “foreign” male servant in white middle-class American and British imperial homes caused sexual anxieties and compromised the chastity of the house mistress. Sexual connotations and fears of “miscegenation” were removed through the degrading term “boy”, routinely used for adult non-white menservants. The attempt to emasculate Chinese men extended to the point where these men-servants were seen as a third gender or “eunuch”, outside the binary of male and female. Caricatures of Chinese “houseboys” and “laundry boys” abounded in trade cards and postcards, reflecting and perpetuating anxieties of Asian immigration to the United States. The desexualized infantilized Chinese “houseboy” stereotype also upheld the masculinity of white men in the British Empire.`,
            image: "/images/history/Chinese menservants.jpg",
        },
        {
            title: "Black Pete",
            content: `Black Pete (Zwarte Piet) is Santa Claus’ helper/servant in Dutch and Belgian Christmas culture. He is a racially ambiguous dark-skinned person, originally depicted as Moorish, but he gradually morphed into a generic “Oriental” figure by the early-1900s, representing various colonized subjects of the Dutch Empire (i.e., West Indies, Indonesia, various African and Caribbean colonies). In the Belgian postcards, Black Pete is painted in un unnatural shade of jet black, similar to Belgian racist caricatures of colonized Congolese people. In popular Christmas postcards from the early-1900s, Black Pete and Santa Claus serve as foils to each other; Santa Claus is light-skinned, old, tall, wise, and benevolent—Black Pete is dark-skinned, young, and unserious. Black Pete exists in a subservient role, depicted doing the physical labor (usually carrying a sack or basket full of toys), while Santa Claus only interacts with the children and/or rides a horse instead of walking on equal footing with Black Pete. These choices by postcard illustrators naturalized the servile role of people of color in the Dutch and Belgian Empires.`,
            image: "/images/history/Black Pete.jpeg",
        },
        {
            title: "Monkey Brand",
            content: `Black and Brown men-servants were animalized as a way to dehumanize and degrade them. This can be seen in the popular Monkey Brand Soap advertisements in Britain, where an anthropomorphic monkey was depicted performing domestic labor, understood as the domain of women. The use of a monkey caricature made invisible the domestic labor of working-class white maidservants or colonial servants. The human-monkey hybrid was meant to evoke racist humor in the wake of Darwinian evolutionary theory and simian qualities attributed to supposedly “less-evolved” African, Asian, and Irish people.`,
            image: "/images/history/753A.jpg",
        },
        {
            title: "Harem Postcards and Eunuchs",
            content: `The French postcards in our collection that depict racialized domestics tend to transport European consumers to the imagined site of the “Oriental Harem.” Historically, harems were sectioned-off spaces within a Muslim household for wives, concubines, and female servants, guarded by castrated men, called eunuchs. Depicting such spaces gave European consumers of the ephemera a voyeuristic delight in unveiling the mystery shrouding the intimate domestic lives of their non-white colonized subjects, particularly in North Africa and Asia. The racialized female domestics, often shown with exposed breasts and carrying items like vases or coffee, are at once sexualized, and not only bolster the popular conception of the “Orient” as a place of sexual laxity, but also suggest the serene refreshment that such domestics could provide to an employer or postcard recipient. A stereotypical figure that frequently appears on the French postcards is that of the “eunuch” – the gender-ambiguous guard of the harem, who was particularly fetishized and exoticized in the harem postcards. Dark-skinned maids serving light-skinned mistresses were also a staple of the harem postcard genre.`,
            image: "/images/history/Harem - eunuch.jpg",
        },
    ],
    conclusion: [
        {
            title: "Erasure of Domestic workers' Voices",
            content: `Throughout their many stages of production and travel, our trade cards and postcards --and the
        stereotypes about domestic servants that they perpetuated--remained almost exclusively
        controlled by those from imperialist societies. As a consequence, the domestic servants who are
        routinely racialized, sexualized, infantilized, and otherwise degraded lacked the means
        necessary to produce their own postcards and trade cards to counter these narratives. By
        deconstructing these sources and problematizing them, we have tried to avoid perpetuating the
        harmful messages in their content, but our inability to recover sources that reveal the
        servants’ perspectives unfortunately reproduces the archival erasure of their agency and
        personhood. Just as employers and children in their charge often neglected to learn their names
        and used generic racialized terms such as “Ayah”, “Mammy”, “Baboe”, or “Boy”, there is much
        about the domestic servants in our collected ephemera that remains unknown. Often, the postcards
        and trade cards also leave tropical backgrounds ambiguous, constructing a monolithic “Oriental”
        landscape and deliberately ignoring the diversity of both the locations and peoples that
        colonial domestic industries affected. These cards also erased any exhaustion or pain involved
        in the actual labor and harsh conditions that domestic servants confronted, in effect
        delegitimizing any grievances that they often had about their terms of work. When advertising
        domestic commodities such as soap or wringers, trade cards further effaced contributions of
        domestic workers to the home as well as the grueling nature of their labor by implying that
        modern appliances facilitated their jobs and even eliminated the need for human domestic labor.`,
            image: "/images/history/527A.jpg",
        },
        {
            title: "Hegemonic Construction of Whiteness",
            content: ` Although the trade cards and postcards of racialized domestic workers tell us very little about
        the lived experiences of these marginalized people, they do tell us a lot about white
        middle/upper class people who employed them and collected these ephemera. They give us valuable
        glimpses into popular social and cultural attitudes in the age of New Imperialism and scientific
        racism. European colonizing forces self-constructed a hierarchy of race and attached it to their
        notions of purity and superiority. This fabricated ladder of blood purity was influenced by
        class and gender, which made these constructions of whiteness conveniently flexible based on
        what the location was and who the dominant class consisted of. Even within the commonly
        understood categories of race, such as ‘white,’ one’s social standing, occupation, family
        lineage, faith, and wealth made the degree of whiteness variable from person to person.
        Regardless of regional nuances, the basic implication of this Eurocentric rhetoric was that
        purity was held in the whitest of races, and the subsequent racialized categories were not only
        impure, but degenerations of the white race. It is through the bodies of domestic servants that
        these hierarchies of race and understandings of class and gender are projected. The
        intersectional identities of domestic servants, both within imperial environments and outside,
        became the faces of their racialized population through the proliferation of trade and
        postcards; the construction of these gendered and racialized domestic servants, to the white
        imagination, represented their entire ethnic or racial group. Trade cards and postcards were
        complicit in this racist history in that they provided visual fuel to socialize both the
        dominant and subaltern classes into embodying this ideology.`,
            image: "/images/history/254A.jpg",
        },
        {
            title: "Lasting Impacts",
            content: `While the “servant problem” may be a thing of the past, paid care labor in the Global North is
        still largely provided by women of color, and immigrant women from the Global South,
        particularly in the wake of neoliberalization. In a continuity from cross-racial wetnursing,
        reproductive labor and even surrogacy is now outsourced by wealthy American and European couples
        to women in Asia and Africa. Stereotypes and racialized ideas of domestic labor did not die out
        either after the mid twentieth century. Popular media from this time seeps into the present in
        the form of children’s books and movies. And for the children who read these books, learning
        history fraught with caricatures of people of color perpetuates the teaching of systematic
        racism. Characters like the Ayah from Frances Hodgson Burnett’s The Secret Garden, Amelia
        Bedelia from the titular books, and various Black characters in the American Girl series
        passively diffuse ideas of racialized servitude, sexuality and imbecility of working-class
        women, immigrants and racialized groups. And as child consumers become adults, characters like
        Aunt Jemima, Flo from Progressive, and Manjula and Apu from The Simpsons still normalize
        racialized stereotypes. Mammy, Bridget and the Ayah may have left the world of trade cards and
        postcards, but they still shape the way people of color, immigrants, and domestic workers are
        perceived.`,
            image: "/images/history/",
        },
    ],
};

export { API_URL, MAIN_NAV_LINKS, MAX_ZOOM_FOR_MAP, ABOUT_PAGE_CONTENT, HISTORY_PAGE_CONTENT, BIBLIOGRAPHY_CONTENT };
