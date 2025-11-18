interface Mapper<TInput, TOuput> {
    map(input: TInput): TOuput;
}

/**
 * A generic mapper class that implements the Mapper generic interface.
 * This class is used to transform an input of type `TInput` to an output of type `TOuput`.
 *
 * @template TInput - The type of the input object.
 * @template TOuput - The type of the output object.
 * @implements {Mapper<TInput, TOuput>}
 */
export class GenericMapper<TInput, TOuput> implements Mapper<TInput, TOuput> {
    constructor(
        private readonly transform: (input: TInput) => TOuput
    ) {}

    map(input: TInput): TOuput {
        return this.transform(input);
    }
}