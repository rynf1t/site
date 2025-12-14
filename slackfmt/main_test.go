package main

import (
	"strings"
	"testing"
)

func TestMarkdownToSlack(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "bold text",
			input:    "**bold**",
			expected: "*bold*",
		},
		{
			name:     "italic text",
			input:    "*italic*",
			expected: "_italic_",
		},
		{
			name:     "heading",
			input:    "# Heading",
			expected: "*Heading*",
		},
		{
			name:     "heading with newline",
			input:    "# Heading\n",
			expected: "*Heading*\n",
		},
		{
			name:     "bullet list",
			input:    "- Item 1\n- Item 2",
			expected: "• Item 1\n• Item 2",
		},
		{
			name:     "link",
			input:    "[text](https://example.com)",
			expected: "<https://example.com|text>",
		},
		{
			name:     "code block",
			input:    "```\ncode\n```",
			expected: "```\ncode\n```",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := markdownToSlack(tt.input)
			if result != tt.expected {
				t.Errorf("expected %q, got %q", tt.expected, result)
			}
		})
	}
}

func TestMarkdownToHTML(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "heading h1",
			input:    "# Heading",
			expected: "<h1>Heading</h1>",
		},
		{
			name:     "heading h2",
			input:    "## Heading",
			expected: "<h2>Heading</h2>",
		},
		{
			name:     "bold text",
			input:    "**bold**",
			expected: "<strong>bold</strong>",
		},
		{
			name:     "italic text",
			input:    "*italic*",
			expected: "<em>italic</em>",
		},
		{
			name:     "link",
			input:    "[text](https://example.com)",
			expected: "<a href=\"https://example.com\">text</a>",
		},
		{
			name:     "bullet list",
			input:    "- Item 1\n- Item 2",
			expected: "<ul><li>Item 1</li><li>Item 2</li></ul>",
		},
		{
			name:     "numbered list",
			input:    "1. Item 1\n2. Item 2",
			expected: "<ol><li>Item 1</li><li>Item 2</li></ol>",
		},
		{
			name:     "blockquote",
			input:    "> Quote text",
			expected: "<blockquote>Quote text</blockquote>",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := markdownToHTML(tt.input)
			// Remove <br> tags and normalize whitespace for comparison
			result = strings.ReplaceAll(result, "<br>", "")
			result = strings.ReplaceAll(result, "\n", "")
			expected := strings.ReplaceAll(tt.expected, "\n", "")
			if !strings.Contains(result, expected) {
				t.Errorf("expected to contain %q, got %q", expected, result)
			}
		})
	}
}

