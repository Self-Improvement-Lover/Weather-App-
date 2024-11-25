export function queryByTestId<T extends HTMLElement = HTMLElement>(
  element: HTMLElement,
  testId: string
) {
  return element.querySelector<T>(`[data-testid=${testId}]`);
}

export function queryAllByTestId<T extends HTMLElement = HTMLElement>(
  element: HTMLElement,
  testId: string
) {
  return Array.from(element.querySelectorAll<T>(`[data-testid=${testId}]`));
}
