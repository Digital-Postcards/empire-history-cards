const LoaderDiv = () => {
    return <div className="loader"></div>;
}
const Loader = (props: { isFullSize: boolean, classes: string }) => {
    if (props?.isFullSize)
        return (
            <div className={`min-h-screen w-screen flex justify-center items-center ${props?.classes}`}>
                <LoaderDiv />
            </div>
        )
    
    return <LoaderDiv />
}

export default Loader;