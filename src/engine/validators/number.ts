type NumberOptions = {
    allowZero?: boolean
    editorType?: "select" | 'textfield',
    options?: { value: number, label: string }[]
}

export const number: (options?: NumberOptions) => PropertyDecorator = (options: NumberOptions) => (target: any, key: string) => {
    options = options || {};
    if (typeof options.allowZero !== 'boolean') {
        options.allowZero = true;
    }
    const editorType = options.editorType || 'textfield'

    target.__metadatas = target.__metadatas || [];
    target.__metadatas.push({
        editorType,
        key,
        options: options.options,
        type: 'number',
        validator: (value: any) => {
            if (typeof value !== 'number') {
                throw new Error(`${target.constructor.name}的${key}属性应该是一个数字`)
            }
            if (!options.allowZero && value === 0) {
                throw new Error(`${target.constructor.name}的${key}属性不能是0`)
            }
        }
    });
}