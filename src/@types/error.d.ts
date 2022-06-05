type Return<T> = [result?: T, error?: Error]
type HandleError = <T>(promise: Promise<T>) => Promise<Return<T>>
