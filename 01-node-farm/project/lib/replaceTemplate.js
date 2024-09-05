const replaceTemplate = (template, {
    productName = "Unnamed",
    image = "",
    price = "0.0",
    from = "No place",
    nutrients = "",
    quantity = "0",
    id = "-1",
    description = "No description",
    organic = false
}) => {
    let output = structuredClone(template)

    for (let [field, value] of [
        [/{%PRODUCT_NAME%}/g, productName],
        [/{%PRODUCT_IMAGE%}/g, image],
        [/{%PRODUCT_PRICE%}/g, price],
        [/{%PRODUCT_FROM%}/g, from],
        [/{%PRODUCT_NUTRIENTS%}/g, nutrients],
        [/{%PRODUCT_QUANTITY%}/g, quantity],
        [/{%PRODUCT_DESCRIPTION%}/g, description],
        [/{%PRODUCT_ID%}/g, id]])
        output = output.replace(field, value)

    if (!organic) output = output.replace(/{%PRODUCT_IS_ORGANIC%}/g, 'not-organic')
    return output
}
export default replaceTemplate