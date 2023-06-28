type StringOptions = {
    editorType: 'textfield' | 'select',
    options?: { value: string, label: string }[]
}

export const string: (options?: StringOptions) => PropertyDecorator = (options: StringOptions) => (target: any, key: string) => {
    options = options || { editorType: 'textfield' };
    target.__metadatas = target.__metadatas || [];
    target.__metadatas.push({
        editorType: options.editorType,
        key,
        type: 'string',
        options: options.options,
        validator: (value: any) => {
            return true;
        }
    });
}