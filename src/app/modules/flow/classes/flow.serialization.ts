export declare interface FlowSerialization<T> {
  /**
   * Serializes JS Object to JSON representation
   * @returns string
   */
  _serialize(): T;
  /**
   * Deserializes JSON representation to JS Object
   * @returns T
   */
  // _deserialize(): T;
}
