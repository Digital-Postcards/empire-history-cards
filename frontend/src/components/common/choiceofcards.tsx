import { ChoiceCard } from "components/cards";

const ChoiceOfCards = (props: { classes?: string }) => {
    return (
        <div className={`w-full grid lg:grid-cols-2 grid-cols-1 ` + props?.classes}>
            <ChoiceCard
                type="postcard"
                title="Postcards"
                image="/images/carousel/one.jpg"
                classes="border border-white border-0 border-b lg:border-r lg:border-b-0"
            >
                <p>Lorem ipsum odor amet, consectetuer adipiscing elit. Blandit penatibus neque maximus cursus conubia. Facilisi bibendum est magna egestas, massa sollicitudin. Pellentesque tristique nascetur netus lobortis porttitor aenean. Tempus sit congue ligula fusce nulla molestie mi ex varius. Tortor ridiculus efficitur ad inceptos mus lectus diam. Luctus platea mauris scelerisque condimentum finibus sapien primis platea. Varius taciti fusce venenatis molestie eget erat nisi. Ornare nostra lobortis sem vestibulum purus phasellus faucibus cubilia. Sapien justo libero auctor aliquam orci velit fermentum.</p>
            </ChoiceCard>
            <ChoiceCard
                type="tradecard"
                title="Tradecards"
                image="/images/wiki/one.jpg"
            >
                <p>Lorem ipsum odor amet, consectetuer adipiscing elit. Blandit penatibus neque maximus cursus conubia. Facilisi bibendum est magna egestas, massa sollicitudin. Pellentesque tristique nascetur netus lobortis porttitor aenean. Tempus sit congue ligula fusce nulla molestie mi ex varius. Tortor ridiculus efficitur ad inceptos mus lectus diam. Luctus platea mauris scelerisque condimentum finibus sapien primis platea. Varius taciti fusce venenatis molestie eget erat nisi. Ornare nostra lobortis sem vestibulum purus phasellus faucibus cubilia. Sapien justo libero auctor aliquam orci velit fermentum.</p>
            </ChoiceCard>
        </div>
    )
}

export default ChoiceOfCards;