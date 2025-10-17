export interface Command<TInput = void, TResult = void> {
  execute(input: TInput): Promise<TResult>;
}
