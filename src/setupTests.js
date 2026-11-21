// jest-dom adds custom jest matchers for asserting on DOM nodes.
import "@testing-library/jest-dom";

// Mock react-leaflet & leaflet untuk lingkungan testing (Jest / JSDOM)
jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div data-testid="mock-map">{children}</div>,
  TileLayer: () => <div data-testid="mock-tile" />,
  Marker: ({ children }) => <div data-testid="mock-marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="mock-popup">{children}</div>,
  useMap: () => ({}),
}));

jest.mock("leaflet", () => ({
  Icon: jest.fn().mockImplementation(() => ({})),
}));
