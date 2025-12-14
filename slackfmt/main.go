package main

import (
	"bufio"
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

	// Convert markdown to Slack format (for plain text fallback)
	slackText := markdownToSlack(input)

	// Convert markdown directly to HTML (preserves heading structure)
	htmlText := markdownToHTML(input)

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

	// Convert headers first and protect them
	headerPattern := regexp.MustCompile(`(?m)^(#{1,3}) (.*)$`)
	headerMatches := headerPattern.FindAllStringSubmatch(slack, -1)
	headerPlaceholders := make([]string, len(headerMatches))
	for i, match := range headerMatches {
		if len(match) >= 3 {
			headerPlaceholders[i] = "*" + match[2] + "*"
			slack = strings.Replace(slack, match[0], fmt.Sprintf("__HEADER_%d__", i), 1)
		}
	}

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
	italicPattern := regexp.MustCompile(`(?m)\*([^*\n]+?)\*`)
	slack = italicPattern.ReplaceAllStringFunc(slack, func(match string) string {
		submatches := italicPattern.FindStringSubmatch(match)
		if len(submatches) > 1 {
			return "_" + submatches[1] + "_"
		}
		return match
	})

	// Restore bold placeholders
	for i, content := range boldPlaceholders {
		slack = strings.Replace(slack, fmt.Sprintf("__BOLD_%d__", i), "*"+content+"*", 1)
	}

	// Restore header placeholders (after italic conversion to avoid conflicts)
	for i, content := range headerPlaceholders {
		slack = strings.Replace(slack, fmt.Sprintf("__HEADER_%d__", i), content, 1)
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

func markdownToHTML(markdown string) string {
	html := markdown

	// Protect code blocks first
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

	// Convert headings to HTML heading tags (before other formatting)
	html = regexp.MustCompile(`(?m)^### (.*)$`).ReplaceAllString(html, "<h3>$1</h3>")
	html = regexp.MustCompile(`(?m)^## (.*)$`).ReplaceAllString(html, "<h2>$1</h2>")
	html = regexp.MustCompile(`(?m)^# (.*)$`).ReplaceAllString(html, "<h1>$1</h1>")

	// Convert bold **text** to <strong> first (use placeholder to avoid conflicts)
	boldPattern := regexp.MustCompile(`\*\*(.+?)\*\*`)
	boldMatches := boldPattern.FindAllStringSubmatch(html, -1)
	boldPlaceholders := make([]string, len(boldMatches))
	for i, match := range boldMatches {
		if len(match) > 1 {
			boldPlaceholders[i] = match[1]
			html = strings.Replace(html, match[0], fmt.Sprintf("__BOLD_%d__", i), 1)
		}
	}

	// Convert italic *text* to <em> (now safe since bold is protected)
	html = regexp.MustCompile(`(?m)\*([^*\n]+?)\*`).ReplaceAllString(html, "<em>$1</em>")

	// Restore bold placeholders
	for i, content := range boldPlaceholders {
		html = strings.Replace(html, fmt.Sprintf("__BOLD_%d__", i), "<strong>"+content+"</strong>", 1)
	}

	// Convert strikethrough
	html = regexp.MustCompile(`~~(.+?)~~`).ReplaceAllString(html, "<del>$1</del>")

	// Convert links
	html = regexp.MustCompile(`\[([^\]]+)\]\(([^)]+)\)`).ReplaceAllString(html, "<a href=\"$2\">$1</a>")

	// Convert blockquotes
	html = regexp.MustCompile(`(?m)^> (.+)$`).ReplaceAllString(html, "<blockquote>$1</blockquote>")

	// Convert lists - process line by line
	lines := strings.Split(html, "\n")
	var processedLines []string
	inList := false
	listType := ""

	for _, line := range lines {
		bulletMatch := regexp.MustCompile(`^(\s*)[-*] (.+)$`).FindStringSubmatch(line)
		numberMatch := regexp.MustCompile(`^(\s*)\d+\. (.+)$`).FindStringSubmatch(line)

		if bulletMatch != nil {
			if !inList || listType != "ul" {
				if inList {
					processedLines = append(processedLines, fmt.Sprintf("</%s>", listType))
				}
				processedLines = append(processedLines, "<ul>")
				inList = true
				listType = "ul"
			}
			processedLines = append(processedLines, fmt.Sprintf("<li>%s</li>", bulletMatch[2]))
		} else if numberMatch != nil {
			if !inList || listType != "ol" {
				if inList {
					processedLines = append(processedLines, fmt.Sprintf("</%s>", listType))
				}
				processedLines = append(processedLines, "<ol>")
				inList = true
				listType = "ol"
			}
			processedLines = append(processedLines, fmt.Sprintf("<li>%s</li>", numberMatch[2]))
		} else {
			if inList {
				processedLines = append(processedLines, fmt.Sprintf("</%s>", listType))
				inList = false
				listType = ""
			}
			processedLines = append(processedLines, line)
		}
	}
	if inList {
		processedLines = append(processedLines, fmt.Sprintf("</%s>", listType))
	}
	html = strings.Join(processedLines, "\n")

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

	// Convert remaining newlines to <br> (but not inside block elements)
	html = strings.ReplaceAll(html, "\n", "<br>")

	// Clean up: remove <br> tags that are inside/after block elements
	html = regexp.MustCompile(`(</h[1-6]>)<br>`).ReplaceAllString(html, "$1")
	html = regexp.MustCompile(`(</li>)<br>`).ReplaceAllString(html, "$1")
	html = regexp.MustCompile(`(</blockquote>)<br>`).ReplaceAllString(html, "$1")
	html = regexp.MustCompile(`(</ul>)<br>`).ReplaceAllString(html, "$1")
	html = regexp.MustCompile(`(</ol>)<br>`).ReplaceAllString(html, "$1")
	html = regexp.MustCompile(`(<h[1-6]>)<br>`).ReplaceAllString(html, "$1")
	html = regexp.MustCompile(`(<ul>)<br>`).ReplaceAllString(html, "$1")
	html = regexp.MustCompile(`(<ol>)<br>`).ReplaceAllString(html, "$1")
	html = regexp.MustCompile(`(<li>)<br>`).ReplaceAllString(html, "$1")
	html = regexp.MustCompile(`(<blockquote>)<br>`).ReplaceAllString(html, "$1")

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
	// macOS requires using AppleScript to set HTML clipboard format
	// We use temporary files to avoid escaping issues with AppleScript
	
	// Create temporary file for HTML
	tmpHTML, err := os.CreateTemp("", "slackfmt-*.html")
	if err != nil {
		return fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(tmpHTML.Name())
	defer tmpHTML.Close()

	if _, err := tmpHTML.WriteString(html); err != nil {
		return fmt.Errorf("failed to write HTML to temp file: %w", err)
	}
	tmpHTML.Close()

	// Create temporary file for plain text
	tmpPlain, err := os.CreateTemp("", "slackfmt-*.txt")
	if err != nil {
		return fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(tmpPlain.Name())
	defer tmpPlain.Close()

	if _, err := tmpPlain.WriteString(plain); err != nil {
		return fmt.Errorf("failed to write plain text to temp file: %w", err)
	}
	tmpPlain.Close()

	// Use AppleScript to set both HTML and plain text clipboard formats
	// macOS clipboard supports multiple formats simultaneously
	script := fmt.Sprintf(`
		set htmlFile to POSIX file "%s"
		set plainFile to POSIX file "%s"
		set htmlData to (read htmlFile as «class HTML»)
		set plainData to (read plainFile as «class utf8»)
		set the clipboard to htmlData
		set the clipboard to plainData
	`, tmpHTML.Name(), tmpPlain.Name())

	cmd := exec.Command("osascript", "-e", script)
	if err := cmd.Run(); err != nil {
		// Fallback to plain text if HTML clipboard fails
		return clipboard.WriteAll(plain)
	}

	return nil
}
