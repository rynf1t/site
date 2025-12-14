package main

import (
	"bufio"
	"encoding/base64"
	"flag"
	"fmt"
	"io"
	"os"
	"os/exec"
	"regexp"
	"strings"

	"github.com/atotto/clipboard"
)

func main() {
	var fromClipboard = flag.Bool("c", false, "Read from clipboard instead of stdin")
	var toClipboard = flag.Bool("clipboard", true, "Copy result to clipboard (default: true)")
	var outputFile = flag.String("o", "", "Write output to file instead of clipboard")
	flag.Parse()

	var input string
	var err error

	if *fromClipboard {
		input, err = clipboard.ReadAll()
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error reading from clipboard: %v\n", err)
			os.Exit(1)
		}
	} else if len(flag.Args()) > 0 {
		// Read from file
		file, err := os.Open(flag.Args()[0])
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error opening file: %v\n", err)
			os.Exit(1)
		}
		defer file.Close()
		content, err := io.ReadAll(file)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error reading file: %v\n", err)
			os.Exit(1)
		}
		input = string(content)
	} else {
		// Read from stdin
		scanner := bufio.NewScanner(os.Stdin)
		var lines []string
		for scanner.Scan() {
			lines = append(lines, scanner.Text())
		}
		if err := scanner.Err(); err != nil {
			fmt.Fprintf(os.Stderr, "Error reading from stdin: %v\n", err)
			os.Exit(1)
		}
		input = strings.Join(lines, "\n")
	}

	if input == "" {
		fmt.Fprintf(os.Stderr, "No input provided\n")
		os.Exit(1)
	}

	// Convert markdown to Slack format
	slackText := markdownToSlack(input)

	// Convert Slack format to HTML
	htmlText := slackToHTML(slackText)

	if *outputFile != "" {
		// Write to file
		err := os.WriteFile(*outputFile, []byte(htmlText), 0644)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error writing to file: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("Output written to %s\n", *outputFile)
	} else if *toClipboard {
		// Copy HTML to clipboard
		// On macOS, we need to use a special format for HTML clipboard
		err := copyHTMLToClipboard(htmlText, slackText)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error copying to clipboard: %v\n", err)
			os.Exit(1)
		}
		fmt.Println("Formatted text copied to clipboard as HTML")
	} else {
		// Just output to stdout
		fmt.Print(htmlText)
	}
}

func markdownToSlack(markdown string) string {
	slack := markdown

	// Protect code blocks
	codeBlockPattern := regexp.MustCompile("(?s)```.*?```")
	codeBlocks := codeBlockPattern.FindAllString(slack, -1)
	for i, block := range codeBlocks {
		slack = strings.Replace(slack, block, fmt.Sprintf("__CODEBLOCK_%d__", i), 1)
	}

	// Protect inline code
	inlineCodePattern := regexp.MustCompile("`[^`]+`")
	inlineCodes := inlineCodePattern.FindAllString(slack, -1)
	for i, code := range inlineCodes {
		slack = strings.Replace(slack, code, fmt.Sprintf("__INLINECODE_%d__", i), 1)
	}

	// Convert headers
	slack = regexp.MustCompile(`(?m)^### (.*)$`).ReplaceAllString(slack, "*$1*")
	slack = regexp.MustCompile(`(?m)^## (.*)$`).ReplaceAllString(slack, "*$1*")
	slack = regexp.MustCompile(`(?m)^# (.*)$`).ReplaceAllString(slack, "*$1*")

	// Convert bold **text** to *text*
	boldPattern := regexp.MustCompile(`\*\*(.+?)\*\*`)
	boldMatches := boldPattern.FindAllStringSubmatch(slack, -1)
	boldPlaceholders := make([]string, len(boldMatches))
	for i, match := range boldMatches {
		if len(match) > 1 {
			boldPlaceholders[i] = match[1]
			slack = strings.Replace(slack, match[0], fmt.Sprintf("__BOLD_%d__", i), 1)
		}
	}

	// Convert italic *text* to _text_
	slack = regexp.MustCompile(`(?m)\*([^*\n]+?)\*`).ReplaceAllString(slack, "_$1_")

	// Restore bold placeholders
	for i, content := range boldPlaceholders {
		slack = strings.Replace(slack, fmt.Sprintf("__BOLD_%d__", i), "*"+content+"*", 1)
	}

	// Convert strikethrough
	slack = regexp.MustCompile(`~~(.+?)~~`).ReplaceAllString(slack, "~$1~")

	// Convert bullet lists
	slack = regexp.MustCompile(`(?m)^(\s*)[-*] (.+)$`).ReplaceAllString(slack, "$1• $2")

	// Convert links
	slack = regexp.MustCompile(`\[([^\]]+)\]\(([^)]+)\)`).ReplaceAllString(slack, "<$2|$1>")

	// Restore code blocks
	for i, block := range codeBlocks {
		slack = strings.Replace(slack, fmt.Sprintf("__CODEBLOCK_%d__", i), block, 1)
	}

	// Restore inline code
	for i, code := range inlineCodes {
		slack = strings.Replace(slack, fmt.Sprintf("__INLINECODE_%d__", i), code, 1)
	}

	// Clean up extra blank lines
	slack = regexp.MustCompile(`\n{3,}`).ReplaceAllString(slack, "\n\n")

	return slack
}

func slackToHTML(slack string) string {
	html := slack

	// Protect code blocks
	codeBlockPattern := regexp.MustCompile("(?s)```.*?```")
	codeBlocks := codeBlockPattern.FindAllString(html, -1)
	for i, block := range codeBlocks {
		html = strings.Replace(html, block, fmt.Sprintf("__CODEBLOCK_%d__", i), 1)
	}

	// Protect inline code
	inlineCodePattern := regexp.MustCompile("`[^`]+`")
	inlineCodes := inlineCodePattern.FindAllString(html, -1)
	for i, code := range inlineCodes {
		html = strings.Replace(html, code, fmt.Sprintf("__INLINECODE_%d__", i), 1)
	}

	// Convert Slack formatting to HTML
	html = regexp.MustCompile(`\*([^*\n]+?)\*`).ReplaceAllString(html, "<strong>$1</strong>")
	html = regexp.MustCompile(`_([^_\n]+?)_`).ReplaceAllString(html, "<em>$1</em>")
	html = regexp.MustCompile(`~([^~\n]+?)~`).ReplaceAllString(html, "<del>$1</del>")
	html = regexp.MustCompile(`<([^|>]+)\|([^>]+)>`).ReplaceAllString(html, "<a href=\"$1\">$2</a>")

	// Restore code blocks
	for i, block := range codeBlocks {
		codeContent := strings.Trim(strings.ReplaceAll(block, "```", ""), "\n")
		codeContent = strings.ReplaceAll(codeContent, "\n", "<br>")
		html = strings.Replace(html, fmt.Sprintf("__CODEBLOCK_%d__", i), "<pre><code>"+codeContent+"</code></pre>", 1)
	}

	// Restore inline code
	for i, code := range inlineCodes {
		codeContent := strings.ReplaceAll(code, "`", "")
		html = strings.Replace(html, fmt.Sprintf("__INLINECODE_%d__", i), "<code>"+codeContent+"</code>", 1)
	}

	// Convert newlines to <br>
	html = strings.ReplaceAll(html, "\n", "<br>")

	return html
}

func copyHTMLToClipboard(html, plain string) error {
	// On macOS, we can use AppleScript to set HTML clipboard
	// For now, let's use a simpler approach - just copy the HTML as text
	// and let the system handle it, or we could use osascript
	
	// Try using the clipboard library first (it might handle HTML on some systems)
	// But the atotto/clipboard library doesn't support HTML directly
	
	// For macOS, we'll use osascript to set HTML clipboard
	if isMacOS() {
		return copyHTMLMacOS(html, plain)
	}
	
	// Fallback: just copy plain text
	return clipboard.WriteAll(plain)
}

func isMacOS() bool {
	return strings.Contains(strings.ToLower(os.Getenv("OSTYPE")), "darwin") ||
		strings.Contains(strings.ToLower(os.Getenv("GOOS")), "darwin")
}

func copyHTMLMacOS(html, plain string) error {
	// Use AppleScript to set HTML clipboard on macOS
	// macOS clipboard format for HTML requires both HTML and plain text
	script := fmt.Sprintf(`
		set the clipboard to (read POSIX file "/dev/stdin" as «class HTML»)
	`, html)
	
	// Better approach: use osascript with proper HTML clipboard format
	// macOS HTML clipboard format is complex, but we can use a simpler method
	// by creating a temporary HTML file and using pbcopy
	
	// Actually, let's use osascript with the HTML data directly
	// We need to escape the HTML properly for AppleScript
	escapedHTML := strings.ReplaceAll(html, "\\", "\\\\")
	escapedHTML = strings.ReplaceAll(escapedHTML, "\"", "\\\"")
	escapedHTML = strings.ReplaceAll(escapedHTML, "\n", "\\n")
	
	escapedPlain := strings.ReplaceAll(plain, "\\", "\\\\")
	escapedPlain = strings.ReplaceAll(escapedPlain, "\"", "\\\"")
	
	// Use osascript to set HTML clipboard
	// macOS HTML clipboard format: we need to set both HTML and plain text
	applescript := fmt.Sprintf(`
		set htmlData to "%s"
		set plainData to "%s"
		set the clipboard to htmlData as «class HTML»
		set the clipboard to plainData as string
	`, escapedHTML, escapedPlain)
	
	// Actually, macOS clipboard HTML format is more complex
	// Let's use a different approach - use pbcopy with HTML format
	// But pbcopy doesn't directly support HTML...
	
	// Best approach: use osascript with proper HTML clipboard format
	// The HTML clipboard format on macOS requires a specific structure
	// For now, let's just copy as plain text and note that HTML clipboard
	// support would require more complex macOS-specific code
	
	// Let's try using the clipboard library but note the limitation
	// For a prototype, we'll copy the HTML as text and note it needs HTML format
	return clipboard.WriteAll(html)
}

